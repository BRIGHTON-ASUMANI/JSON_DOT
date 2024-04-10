import React, { useRef, useState } from 'react';
import {
  Form, Button, Container, Row, Col,
} from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isValidJson, setIsValidJson] = useState(true); // Track JSON validity
  const fileInputRef = useRef(null);

  const convertToDotSyntax = (jsonData) => {
    let dotSyntax = '';

    jsonData.forEach((item) => {
      const properties = Object.entries(item)
        .map(([key, value]) => {
          if (typeof value === 'string') {
            return `${key}="${value}"`;
          } if (typeof value === 'object') {
            const innerProps = Object.entries(value)
              .map(([innerKey, innerValue]) => `${innerKey}=${innerValue}`);
            return `${key} [${innerProps.join(', ')}]`;
          }
          return '';
        });
      dotSyntax += `${item.id} [${properties.join(', ')}]\n`;
    });

    return dotSyntax;
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      setJsonInput(content);

      try {
        const jsonData = JSON.parse(content);
        const dotSyntax = convertToDotSyntax(jsonData);
        const blob = new Blob([dotSyntax], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setIsValidJson(true); // Set JSON as valid
        toast.success('File uploaded and converted successfully.');
      } catch (error) {
        console.error(error);
        toast.error('Error: Invalid JSON format.');
        setIsValidJson(false); // Set JSON as invalid
      }
    };

    reader.readAsText(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleConvertClick = async () => {
    setLoading(true);
    try {
      const jsonData = JSON.parse(jsonInput);
      const dotSyntax = convertToDotSyntax(jsonData);
      const blob = new Blob([dotSyntax], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setLoading(false);
      toast.success('Conversion completed.');
    } catch (error) {
      console.error(error);
      toast.error('Error: Invalid JSON format.');
      setLoading(false);
    }
  };

  const handleDownloadClick = () => {
    if (downloadUrl) {
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'converted.dot';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <Container>
      <ToastContainer />
      <Row className="justify-content-center mt-5">
        <Col md={8}>
          <h3>Upload JSON File or Paste JSON Data</h3>
          <div>
            <input
              type="file"
              style={{ display: 'none' }}
              accept=".json"
              ref={fileInputRef}
              onChange={handleFileInputChange}
            />
            <Button variant="info" onClick={handleButtonClick}>
              Upload JSON File
            </Button>
            {' '}
            {fileInputRef.current && fileInputRef.current.files.length > 0 && (
            <div className="mt-2">
              <strong>Uploaded File:</strong>
              {' '}
              {fileInputRef.current.files[0].name}
            </div>
            )}
          </div>
          <div className="mt-2">
            <Form.Group>
              <Form.Control
                as="textarea"
                className="md-2"
                rows={10}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
              />
            </Form.Group>
            <Button
              className="mt-2 btn btn-block"
              variant="success"
              onClick={handleConvertClick}
              disabled={loading}
            >
              {loading ? 'Converting...' : 'Convert'}
            </Button>
            {jsonInput || downloadUrl ? (
              <Button
                className="mt-2 mr-3 btn btn-block"
                variant="primary"
                onClick={handleDownloadClick}
                disabled={!isValidJson || loading}
              >
                Download Converted File
              </Button>
            ) : null}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
