import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { CssBaseline, AppBar, Toolbar, Typography, Container } from '@mui/material';
import './styles.css';

const App = () => {
    const [droppedFile, setDroppedFile] = useState(null);
    const [data, setData] = useState(defaultResult());
    const [error, setError] = useState(null);

    const fileInputRef = React.useRef(null);

    const handleDrop = async (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            setDroppedFile(file.name);
            try {
                const inputData = await loadJsonContent(file);
                const t_data = transformData(inputData);
                setData(t_data);
            } catch (error) {
                setError(error.message); // Set error message for Snackbar
            }
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleFileInputChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setDroppedFile(file.name);
            try {
                const inputData = await loadJsonContent(file);
                const t_data = transformData(inputData);
                setData(t_data);
            } catch (error) {
                setError(error.message);
            }
        }
    };

    const handleFileDropClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleCloseSnackbar = () => {
        setError(null); // Clear error when Snackbar is closed
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
                    <div className="cell cell-half">
                        <Typography variant="body1">Meta Data</Typography>
                        <JSONTree data={data.meta} hideRoot={true} theme={metaTheme} />
                    </div>
                    <div
                        className="cell cell-half filedrop-cell"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={handleFileDropClick}
                        style={{
                            border: '2px dashed #ccc',
                            padding: '20px',
                            textAlign: 'center',
                            cursor: 'pointer',
                        }}
                    >
                        <Typography variant="body1">
                            {droppedFile ? `Dropped File: ${droppedFile}` : 'Drag and drop a file here or click to select'}
                        </Typography>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileInputChange}
                        />
                    </div>
                    <div className="cell cell-full">
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {
                                            data?.tableHeader.map((value, index) => (
                                                <TableCell key={index}>{value}</TableCell>
                                            ))
                                        }
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data?.tableData.map((row, index) => (
                                        <TableRow key={index}>
                                            {
                                                row?.map((value, index) => (
                                                    <TableCell key={index}>{JSON.stringify(value)}</TableCell>
                                                ))
                                            }
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </Container>
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));