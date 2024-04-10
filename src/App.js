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
  const fileInputRef = useRef(null); // Initializing with null

  const handleJsonInputChange = (event) => {
    setJsonInput(event.target.value);
    setDownloadUrl(''); // Reset download URL when input changes
  };

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

  const handleConvertClick = async () => {
    setLoading(true);
    try {
      const jsonData = JSON.parse(jsonInput);
      const dotSyntax = convertToDotSyntax(jsonData);
      // Create a Blob with dotSyntax
      const blob = new Blob([dotSyntax], { type: 'text/plain' });
      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url); // Set download URL
      // Reset loading state
      setLoading(false);
      // Show success message
      toast.success('Conversion completed.');
    } catch (error) {
      console.error(error);
      toast.error('Error: Invalid JSON format.');
      setLoading(false);
    }
  };

  const handleDownloadClick = () => {
    if (downloadUrl) {
      // Create a temporary anchor element to trigger the download
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'converted.dot';
      document.body.appendChild(a);
      a.click();
      // Remove the temporary anchor element
      document.body.removeChild(a);
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    // Do something with the selected file
    console.log('Selected file:', file);
  };

  const handleButtonClick = () => {
    // Trigger the click event of the file input element
    fileInputRef.current.click();
  };

  return (
    <Container>
      <ToastContainer />
      <Row className="justify-content-center mt-5">
        <Col md={4}>
          <div>
            <input
              type="file"
              style={{ display: 'none' }}
              accept=".json"
              ref={fileInputRef}
              onChange={handleFileInputChange}
            />
            <Button variant="info" onClick={handleButtonClick}>
              Upload
            </Button>
            {fileInputRef.current && fileInputRef.current.files.length > 0 && (
            <div className="mt-2">
              <strong>Uploaded File:</strong>
              {' '}
              {fileInputRef.current.files[0].name}
            </div>
            )}
          </div>
        </Col>
        <Col md={8}>
          <div>
            <h3>Paste JSON Data</h3>
            <Form.Group>
              <Form.Control
                as="textarea"
                className="md-2"
                rows={10}
                value={jsonInput}
                onChange={handleJsonInputChange}
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
            {downloadUrl && (
              <Button
                className="mt-2 mr-3 btn btn-block"
                variant="primary"
                onClick={handleDownloadClick}
              >
                Download Converted File
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
