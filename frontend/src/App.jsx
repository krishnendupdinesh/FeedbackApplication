import React, { useState, useEffect } from 'react'
import { FaEdit,FaTrashAlt } from 'react-icons/fa'

const API_URL = "http://localhost:4001/comments";

const App = () => {

    const[comments,setComments] =useState([]);
    const[name,setName]=useState("");
    const[text,setText]=useState("");
    const[rating,setRating]=useState(null);
    const[editingId,setEditingId]=useState(null);
    const[showError,setShowError]=useState(false);

    useEffect(()=>{
        const fetchComments = async () => {
            try{
                const response = await fetch (API_URL);

                if(!response.ok){
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setComments(data);
            }catch(error){
                console.error("Error fetching comments:", error);
            }
        }
        fetchComments();
    },[]);

    const handleSubmit = async (e) => {
  e.preventDefault();

  if (!name.trim() || !text.trim() || rating === null) {
    setShowError(true);
    setTimeout(() => setShowError(false), 5000);
    return;
  }

  if (editingId !== null) {
    // Edit existing comment
    const updatedComment = {
      name: name.trim(),
      text: text.trim(),
      rating,
    };

    const res = await fetch(`${API_URL}/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedComment),
    });

    const saved = await res.json();

    setComments((prev) =>
      prev.map((c) => (c.id === editingId ? saved : c))
    );

    setEditingId(null);
  } else {
    // Add new comment
    const newComment = {
      name: name.trim(),
      text: text.trim(),
      rating,
    };

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newComment),
    });

    const saved = await res.json();

    setComments((prev) => [...prev, saved]);
  }

  // Reset form
  setName("");
  setText("");
  setRating(null);
  setShowError(false);
};

        

    //  Delete comment
    const handleDelete = async (id) => {
        if(window.confirm("Are you sure you want to delete this comment?")){
            await fetch(`${API_URL}/${id}`,{
                method: "DELETE",
            });
            setComments((prev)=> prev.filter((c)=> c.id !== id));
    }
    };

    const handleEdit = (comment) => {
        setEditingId(comment.id);
        setName(comment.name);
        setText(comment.text);
        setRating(comment.rating);
    };
    const handleCancelEdit = () => {
        setEditingId(null);
        setName("");
        setText("");
        setRating(null);
    };
        

  return (
    <>
        <div className="app">
      <div className="container">
        {/* Heading */}
        <h2>Leave a Comment</h2>

        {/* form */}
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Your name" value={name} onChange={(e)=>setName(e.target.value)} />
          <textarea placeholder="Your comment..."
          value={text} onChange={(e)=> setText(e.target.value)}></textarea>

          <div className="rating">
            <label>Rate:</label>
            {[1,2,3,4,5].map((num)=>(
                <label key={num} ><input type="radio" name="rating" value={num} checked={rating === num} onChange={()=>setRating(num)} /> {""}{num}</label>
            ))}
            
           
          </div>
          <button type="submit">{editingId ? "Save" : "Submit"}</button>
            {editingId && (
                <button type="button" className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
            )}
            {showError &&(
                <div className="error">Please complete all required fields!</div>
            )
            }
          
        </form>

        {/* Comments Section */}
        <div className="comments">
          {/* comment card */}
          {comments.map((comment)=>(
             <div className="comment-card" key={comment.id}>
            <h4>{comment.name}</h4>
            <p>{comment.text}</p>
            <div className="rating-display">Rating: {comment.rating}</div>
            <div className="comment-actions">
              <button className="edit-btn" onClick={()=>handleEdit(comment)} disabled={editingId === comment.id} ><FaEdit/></button>
              <button className="delete-btn" onClick={() => handleDelete(comment.id)} disabled={editingId === comment.id}>
                <FaTrashAlt/>
              </button>
            </div>
          </div>
          ))}
         
        </div>
      </div>
    </div>
    </>
  )
}

export default App
