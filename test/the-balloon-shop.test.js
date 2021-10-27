let assert = require("assert");
let TheBalloonShop = require("../the-balloon-shop");
const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:moddy123@localhost:5432/my_balloon_tests';

const pool = new Pool({
    connectionString
});

describe('The balloon function', function () {


    beforeEach(async function () {
        // clean the tables before each test run
        await pool.query("delete from valid_color");
        // add valid colors
        await pool.query ("INSERT INTO valid_color(color_name, count)VALUES ($1, $2)", ['Orange', 1]);
        await pool.query("INSERT INTO valid_color(color_name, count)VALUES ($1, $2)", ['Purple', 1]);
        await pool.query("INSERT INTO valid_color(color_name, count)VALUES ($1, $2)", ['Lime', 1]);

    });

    it('should get the valid colors', async function () {

        const theBalloonShop = TheBalloonShop(pool, ['Orange', 'Purple', 'Lime']);
    
        assert.deepEqual([{color_name:'Orange'}, {color_name:'Purple'}, {color_name:'Lime'}], await theBalloonShop.getValidColors());

    });

    it('should get invalid colors', async function () {

        const theBalloonShop = TheBalloonShop(pool, ['Orange', 'Purple', 'Lime']);

        await theBalloonShop.requestColor('Blue');
        await theBalloonShop.requestColor('Red');
        await theBalloonShop.requestColor('Green');

        assert.deepEqual([{color_name:'Blue'}, {color_name:'Red'}, {color_name:'Green'}], await theBalloonShop.getInvalidColors());

    });

    it('should return count for a specific color', async function () {
        const theBalloonShop = TheBalloonShop(pool, ['Orange', 'Purple', 'Lime']);

        await theBalloonShop.requestColor('Orange');
        await theBalloonShop.requestColor('Orange');
        await theBalloonShop.requestColor('Purple');
        await theBalloonShop.requestColor('Orange');
        await theBalloonShop.requestColor('Purple');
        await theBalloonShop.requestColor('Orange');
        await theBalloonShop.requestColor('Lime');

        assert.equal(4, await theBalloonShop.colorCount('Orange'));
        assert.equal(1, await theBalloonShop.colorCount('Lime'));
        assert.equal(2, await theBalloonShop.colorCount('Purple'));

    })

    it('should get all the colors - valid & invalid', async function () {

        const theBalloonShop = TheBalloonShop(pool, ['Orange', 'Purple', 'Lime']);

        await theBalloonShop.requestColor('Blue')
        await theBalloonShop.requestColor('Red')

        assert.equal(['Orange', 'Purple', 'Lime', 'Blue', 'Red'], await theBalloonShop.allColors());

    })

    it('an invalid color should become a valid color after 5 requests', async function () {

        const theBalloonShop = TheBalloonShop(pool, []);

        assert.equal([], await theBalloonShop.getValidColors());

        await theBalloonShop.requestColor('Blue')
        await theBalloonShop.requestColor('Blue')
        await theBalloonShop.requestColor('Red')
        await theBalloonShop.requestColor('Blue')
        await theBalloonShop.requestColor('Blue')

        assert.equal(['Blue', 'Red'], await theBalloonShop.getInValidColors());

        await theBalloonShop.requestColor('Blue')

        assert.equal(['Blue'], await theBalloonShop.getValidColors());
        assert.equal(['Red'], await theBalloonShop.getInValidColors());

    });

    after(function () {
        pool.end();
    })
});