import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { CssBaseline, AppBar, Toolbar, Typography, Container } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Snackbar, Alert } from '@mui/material';
import { JSONTree } from 'react-json-tree';
import './styles.css';
import { loadJsonContent, transformData, defaultResult } from './loader';
import 'bootstrap-icons/font/bootstrap-icons.css';

const transformToMetaTheme = userTheme => {
    return {
        base00: userTheme["terminal.background"],
        base01: userTheme["terminal.ansiBrightBlack"],
        base02: userTheme["terminal.ansiBlack"],
        base03: userTheme["terminal.foreground"],
        base04: userTheme["terminal.ansiWhite"],
        base05: userTheme["terminal.foreground"],
        base06: userTheme["terminal.ansiBrightWhite"],
        base07: userTheme["terminal.background"],
        base08: userTheme["terminal.ansiRed"],
        base09: userTheme["terminal.ansiBrightRed"],
        base0A: userTheme["terminal.ansiYellow"],
        base0B: userTheme["terminal.ansiGreen"],
        base0C: userTheme["terminal.ansiCyan"],
        base0D: userTheme["terminal.ansiBlue"],
        base0E: userTheme["terminal.ansiMagenta"],
        base0F: userTheme["terminal.ansiBrightYellow"]
    };
}

const metaTheme = transformToMetaTheme({
    "terminal.background": "#FFFFFF",
    "terminal.foreground": "#4D4D4B",
    "terminalCursor.background": "#4E4D4C",
    "terminalCursor.foreground": "#4D4E4C",
    "terminal.ansiBlack": "#FFFFFF",
    "terminal.ansiBlue": "#4270AE",
    "terminal.ansiBrightBlack": "#8F908C",
    "terminal.ansiBrightBlue": "#4271AF",
    "terminal.ansiBrightCyan": "#3E9A9F",
    "terminal.ansiBrightGreen": "#718C01",
    "terminal.ansiBrightMagenta": "#8958A8",
    "terminal.ansiBrightRed": "#C82828",
    "terminal.ansiBrightWhite": "#1D1F20",
    "terminal.ansiBrightYellow": "#EAB701",
    "terminal.ansiCyan": "#3F999F",
    "terminal.ansiGreen": "#728C00",
    "terminal.ansiMagenta": "#8959A9",
    "terminal.ansiRed": "#C8282A",
    "terminal.ansiWhite": "#4D4D4D",
    "terminal.ansiYellow": "#EAB6FF"
});

const MetadataComponent = ({ data, metaTheme }) => (
    <div className="component component-half">
        <Typography variant="body1">Pore Log Viewer Utility</Typography>
        {data.meta && Object.keys(data.meta).length > 0 ? (
            <>
                <Typography variant="h6" style={{ marginTop: '10px' }}>Metadata</Typography>
                <JSONTree data={data.meta} hideRoot={true} theme={metaTheme} />
            </>
        ) : (
            <Typography variant="body2" color="textSecondary" style={{ marginTop: '10px' }}>
                This utility allows you to visualize and analyze log files.
                Drag and drop a JSON file into the drop area or click the drop area to select a file.
            </Typography>
        )}
    </div>
);

const FileDropComponent = ({ droppedFile, fileInputRef, handleDrop, handleDragOver, handleFileDropClick, handleFileInputChange }) => (
    <div
        className="component component-half filedrop-component"
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
        <i className="bi bi-cloud-upload icon"></i>
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
);

const TableComponent = ({ data }) => (
    <div className="component component-full">
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        {data?.tableHeader.map((value, index) => (
                            <TableCell key={index}>{value}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data?.tableData.map((row, index) => (
                        <TableRow key={index}>
                            {row?.map((value, index) => (
                                <TableCell key={index}>{JSON.stringify(value)}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </div>
);

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
                setError(error.message);
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
        setError(null);
    };

    return (
        <>
            <CssBaseline />
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        style={{ fontFamily: 'monospace', fontWeight: 'bold', textTransform: 'uppercase', fontStyle: 'italic', fontSize: '2rem' }}
                    >
                        LAKE ENK
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container>
                <div className="container">
                    <MetadataComponent data={data} metaTheme={metaTheme} />
                    <FileDropComponent
                        droppedFile={droppedFile}
                        fileInputRef={fileInputRef}
                        handleDrop={handleDrop}
                        handleDragOver={handleDragOver}
                        handleFileDropClick={handleFileDropClick}
                        handleFileInputChange={handleFileInputChange}
                    />
                    <TableComponent data={data} />
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