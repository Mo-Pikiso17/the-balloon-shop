module.exports = (pool, validColors) => {

    // insert valid colors into the database here

    async function getValidColors() {

        var data = await pool.query("SELECT color_name FROM valid_color");
        return data.rows
    }

    async function requestColor(color) {

        // var nameFirstLetterCap = color[0].toUpperCase() + color.slice(1).toLowerCase();
        var colors = await pool.query("SELECT color_name FROM valid_color WHERE color_name = $1", [color]);

        if (colors.rows == "Orange") {

            var data = await pool.query("UPDATE valid_color SET count =  count + 1, WHERE color_name = $1", [color]);
            return data.rows
            // return await pool.query("UPDATE valid_color SET count =  count + 1, WHERE color_name = $1", [nameFirstLetterCap]);

        } if (colors.rows == "Purple") {

            var data = await pool.query("UPDATE valid_color SET count =  count + 1, WHERE color_name = $1", [color]);
            data.rows
        }

        if (colors.rows == "Lime") {

            var data = await pool.query("UPDATE valid_color SET count =  count + 1, WHERE color_name = $1", [color]);
            data.rows

        } else {

            return await pool.query("INSERT INTO invalid_color (color_name, count) VALUES ($1, $2)", [color, 1]);

        }

    }

    async function colorCount(color) {

        var data = await pool.query("SELECT * FROM valid_color");

        data.rows

    }

    async function getInvalidColors() {

        var data = await pool.query("SELECT color_name FROM invalid_color");

        data.rows
    }

    async function allColors() {

        // var valid = await pool.query("SELECT color_name FROM invalid_color");

        // var invalid = await pool.query("SELECT color_name FROM invalid_color");
    }

    return {
        getValidColors,
        requestColor,
        colorCount,
        getInvalidColors,
        allColors
    }
}