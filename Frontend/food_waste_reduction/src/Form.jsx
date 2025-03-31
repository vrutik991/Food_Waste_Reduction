import React from 'react'

export const Form = () => {
    return (
        <div>
            <div className="container">
                <div className="signup_form">
                    <form>
                        <label>First Name:</label>
                        <input type="text" name="firstName" />
                        <br />
                        <label>Last Name:</label>
                        <input type="text" name="lastName" />
                        <br />
                        <label>Age:</label>
                        <input type="number" name="age" />
                        <br />
                        <label>Gender:</label>
                        <select name="gender">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                        <button>Submit</button>
                    </form></div>
            </div>
        </div>
    )
}
