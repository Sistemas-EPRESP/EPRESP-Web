import { useState } from 'react';

const LogIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // Aquí puedes manejar el envío del formulario, por ejemplo, hacer una llamada a una API
        console.log('Username:', username);
        console.log('Password:', password);
    };

    return (
        <div>
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Log In</button>
            </form>
        </div>
    );
}

export default LogIn;