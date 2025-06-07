import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { CssBaseline, AppBar, Toolbar, Typography, Container } from '@mui/material';
import './styles.css';

const App = () => {
    const [droppedFile, setDroppedFile] = useState(null);

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            setDroppedFile(file.name);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    return (
        <>
            <CssBaseline />
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">Pore Log Viewer</Typography>
                </Toolbar>
            </AppBar>
            <Container>
                <div className="container">
                    <div
                        className="cell cell-half"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        style={{
                            border: '2px dashed #ccc',
                            padding: '20px',
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="body1">
                            {droppedFile ? `Dropped File: ${droppedFile}` : 'Drag and drop a file here'}
                        </Typography>
                    </div>
                    <div className="cell cell-half">
                        <Typography variant="body1">Cell 2</Typography>
                    </div>
                    <div className="cell cell-full">
                        <Typography variant="body1">Big Cell</Typography>
                    </div>
                </div>
            </Container>
        </>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));