const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db")

//middleware 
app.use(cors()); 
app.use(express.json()) // allows us to use req.body


//Routes//

//get all Todos
app.get("/todos", async(req, res)=>{
    try {
        const allTodos = await pool.query("SELECT * FROM todo");
        res.json(allTodos.rows);
    } catch (err) {
        console.error(err.message);        
    }
})

//get a todo
app.get("/todos/:id", async(req, res)=>{
    try {
        const {id} = req.params;
        const todo = await pool.query("SELECT * FROM TODO WHERE todo_id = $1", [id]);
        res.json(todo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
})

//create a todo

app.post("/todos", async(req, res)=>{
    try {
        const { description } = req.body;
        const newTodo = await pool.query(
            "INSERT INTO todo (description) VALUES ($1) RETURNING *",[description] 
        );
        res.json(newTodo.rows[0]);
    } catch (err) {
        console.error(err.message);        
    }
})

//update a todo 

app.put("/todos/:id", async(req,res)=>{
    try {
        const {id} = req.params;
        const {description} = req.body;
        const updateTodo = await pool.query(
            "UPDATE todo set description = $1 WHERE todo_id = $2", [description, id]
        );
        res.json("Todo was updated successfully");
    } catch (err) {
        console.error(err.message);        
    }

})

//delete a todo

app.delete("/todos/:id", async(req,res)=>{
    const {id} = req.params;
    const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);
    res.json("Todo was successfully Deleted");
});


app.listen(5000, ()=>{
    console.log("Server is starting on port 5000");
})
