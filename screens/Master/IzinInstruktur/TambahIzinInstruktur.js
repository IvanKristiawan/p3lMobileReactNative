import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Container, Card, Form, Row, Col } from "react-native-bootstrap";
import { Box, Alert, Button, Snackbar } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const TambahIzinInstruktur = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [userId, setUserId] = useState(user.id);
  const [jadwalInstrukturId, setJadwalInstrukturId] = useState("");

  const [jadwalInstrukturs, setJadwalInstrukturs] = useState([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    getIzinInstrukturData();
  }, []);

  const getIzinInstrukturData = async (kodeUnit) => {
    setJadwalInstrukturId("");
    const response = await axios.post(`${tempUrl}/jadwalInstrukturs`, {
      _id: user.id,
      token: user.token
    });
    setJadwalInstrukturs(response.data);
    setJadwalInstrukturId(response.data[0].id);
  };

  const saveIzinInstruktur = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/saveIzinInstruktur`, {
          userId,
          jadwalInstrukturId,
          _id: user.id,
          token: user.token
        });
        setLoading(false);
        navigate("/izinInstruktur");
      } catch (error) {
        alert(error);
      }
    } else {
      setError(true);
      setOpen(!open);
    }
    setValidated(true);
  };

  if (loading) {
    return <Loader />;
  }

  const textRight = {
    textAlign: screenSize >= 650 && "right"
  };

  return (
    <Container>
      <Text>Master</Text>
      <Text style={{ fontWeight: 400 }}>Tambah Izin Instruktur</Text>
      <Card>
        <Card.Header>Izin Instruktur</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={saveIzinInstruktur}>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Instruktur Id :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control required value={userId} disabled readOnly />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Jadwal Instruktur :
                  </Form.Label>

                  <Col sm="9">
                    <Form.Select
                      required
                      value={jadwalInstrukturId}
                      onChange={(e) => {
                        setJadwalInstrukturId(e.target.value);
                      }}
                    >
                      {jadwalInstrukturs.map((jadwalGym, index) => (
                        <option value={jadwalGym.id}>
                          {jadwalGym.namaKelas} | {jadwalGym.tanggal} |{" "}
                          {jadwalGym.dariJam}-{jadwalGym.sampaiJam}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Box sx={spacingTop}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/izinInstruktur")}
                sx={{ marginRight: 2 }}
              >
                {"< Kembali"}
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                type="submit"
              >
                Simpan
              </Button>
            </Box>
          </Form>
        </Card.Body>
      </Card>
      {error && (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={alertBox}>
            Data belum terisi semua!
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default TambahIzinInstruktur;

const spacingTop = {
  mt: 4
};

const alertBox = {
  width: "100%"
};
