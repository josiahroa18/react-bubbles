import React, { useState } from "react";
import { axiosWithAuth } from "../utils/axiosWithAuth";
import { useHistory } from 'react-router-dom';

const initialColor = {
  color: "",
  code: { hex: "" }
};

const ColorList = ({ colors, updateColors }) => {
  const [ editing, setEditing ] = useState(false);
  const [ colorToEdit, setColorToEdit ] = useState(initialColor);
  const [ newColor, setNewColor ] = useState({
    color: '',
    code: {
      hex: ''
    }
  });
  const [ error, setError ] = useState(false);

  const history = useHistory();

  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);
  };

  const saveEdit = e => {
    e.preventDefault();
    axiosWithAuth().put(`/api/colors/${colorToEdit.id}`, colorToEdit)
    .then(res => {
      updateColors(colors.map(color => {
        if(color.id === colorToEdit.id){
          return res.data;
        }else{
          return color;
        }
      }));
    })
    .catch(err => {
      console.log(err);
    })
  };

  const deleteColor = color => {
    axiosWithAuth().delete(`/api/colors/${color.id}`)
    .then(() => {
      updateColors(colors.filter(item => {
        if(item.id !== color.id){
          return item;
        }
      }))
    })
    .catch(err => {
      console.log(err);
    })
  };

  const addColor = e => {
    e.preventDefault();
    console.log(newColor);
    if(newColor.color && newColor.code.hex){
      axiosWithAuth().post('/api/colors', newColor)
      .then(res => {
        setError(false);
        updateColors(res.data)
      })
      .catch(err => {
        console.log(err);
      })
    }else{
      setError(true);
    }
    e.target.reset();
  }

  const handleLogout = () => {
    window.localStorage.clear();
    history.push('/');
  }

  return (
    <div className="colors-wrap">
      <button className='logout' onClick={handleLogout}>Log Out</button>
      <p>colors</p>
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span className="delete" onClick={e => {
                    e.stopPropagation();
                    deleteColor(color)
                  }
                }>
                  x
              </span>{" "}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit} className='color-form'>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      <div className="spacer" />
      {/* stretch - build another form here to add a color */}
      {!editing && (
        <div className='add-color'>
          <p>Add new color</p>
          <form onSubmit={addColor}>
            <label>Color Name: </label>
            <input
              onChange={e => 
                setNewColor({ ...newColor, color:e.target.value })
              }
            />
            <label>Hex Code: </label>
            <input
              onChange={e => 
                setNewColor({
                  ...newColor,
                  code: {
                    hex: e.target.value
                  }
                })
              }
            />
            <button type='submit'>Add Color</button>
            {error && <p>Please fill out both fields</p>}
          </form>
        </div>
      )}
      <div className='spacer'/>
    </div>
  );
};

export default ColorList;
