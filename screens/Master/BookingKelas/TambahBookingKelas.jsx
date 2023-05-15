import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Alert, Button, Snackbar } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const TambahBookingKelas = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [noBooking, setNoBooking] = useState("");
  const [userId, setUserId] = useState(user.id);
  const [jadwalInstrukturId, setJadwalInstrukturId] = useState("");

  const [jadwalInstruktur, setJadwalInstruktur] = useState([]);
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
    getNextKodeBookingKelas();
    getBookingKelasData();
  }, []);

  const getNextKodeBookingKelas = async (kodeUnit) => {
    const response = await axios.post(`${tempUrl}/bookingKelasNextKode`, {
      _id: user.id,
      token: user.token,
    });
    setNoBooking(response.data);
  };

  const getBookingKelasData = async (kodeUnit) => {
    setJadwalInstrukturId("");
    const response = await axios.post(`${tempUrl}/jadwalInstruktursMasihAda`, {
      _id: user.id,
      token: user.token,
    });
    setJadwalInstruktur(response.data);
    setJadwalInstrukturId(response.data[0].id);
  };

  const saveBookingKelas = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      const findUser = await axios.post(`${tempUrl}/findUser/${userId}`, {
        _id: user.id,
        token: user.token,
      });
      const findJadwalInstruktur = await axios.post(
        `${tempUrl}/jadwalInstrukturs/${jadwalInstrukturId}`,
        {
          _id: user.id,
          token: user.token,
        }
      );
      if (findUser.data.deposit > findJadwalInstruktur.data.harga) {
        try {
          setLoading(true);
          await axios.post(`${tempUrl}/saveBookingKelas`, {
            userId,
            jadwalInstrukturId,
            _id: user.id,
            token: user.token,
          });
          setLoading(false);
          navigate("/bookingKelas");
        } catch (error) {
          alert(error);
        }
      } else {
        alert(
          `Saldo tidak mencukupi! ${findUser.data.deposit} < ${findJadwalInstruktur.data.harga}`
        );
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
    textAlign: screenSize >= 650 && "right",
  };

  return (
    <Container>
      <Input>Master</Input>
      <Input style={{ fontWeight: 400 }}>Tambah Booking Kelas</Input>
      <Card>
        <Card.Header>Booking Kelas</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={saveBookingKelas}>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    No. Booking :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={noBooking}
                      disabled
                      readOnly
                    />
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
                    Member Id :
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
                    Jml. Member Max :
                  </Form.Label>

                  <Col sm="9">
                    <Form.Select
                      required
                      value={jadwalInstrukturId}
                      onChange={(e) => {
                        setJadwalInstrukturId(e.target.value);
                      }}
                    >
                      {jadwalInstruktur.map((jadwalGym, index) => (
                        <option value={jadwalGym.id}>
                          {jadwalGym.namaKelas} | {jadwalGym.tanggal} |{" "}
                          {jadwalGym.dariJam}-{jadwalGym.sampaiJam} |{" "}
                          {jadwalGym.jumlahMemberMax - jadwalGym.jumlahMember}
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
                onClick={() => navigate("/bookingKelas")}
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

export default TambahBookingKelas;

const spacingTop = {
  mt: 4,
};

const alertBox = {
  width: "100%",
};
