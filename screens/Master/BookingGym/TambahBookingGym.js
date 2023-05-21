import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Container, Card, Form, Row, Col } from "react-native-bootstrap";
import { Box, Alert, Button, Snackbar } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const TambahBookingGym = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [noBooking, setNoBooking] = useState("");
  const [userId, setUserId] = useState(user.id);
  const [jadwalGymId, setJadwalGymId] = useState("");

  const [jadwalGyms, setJadwalGyms] = useState([]);
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
    getNextKodeBookingGym();
    getBookingGymsData();
  }, []);

  const getNextKodeBookingGym = async (kodeUnit) => {
    const response = await axios.post(`${tempUrl}/bookingGymNextKode`, {
      _id: user.id,
      token: user.token,
    });
    setNoBooking(response.data);
  };

  const getBookingGymsData = async (kodeUnit) => {
    setJadwalGymId("");
    const response = await axios.post(`${tempUrl}/jadwalGymsMasihAda`, {
      _id: user.id,
      token: user.token,
    });
    setJadwalGyms(response.data);
    setJadwalGymId(response.data[0].id);
  };

  const saveBookingGym = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/saveBookingGym`, {
          userId,
          jadwalGymId,
          _id: user.id,
          token: user.token,
        });
        setLoading(false);
        navigate("/bookingGym");
      } catch (error) {
        alert(error);
      }
      setLoading(false);
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
      <h3>Master</h3>
      <h5 style={{ fontWeight: 400 }}>Tambah Booking Gym</h5>
      <hr />
      <Card>
        <Card.Header>Booking Gym</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={saveBookingGym}>
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
                      value={jadwalGymId}
                      onChange={(e) => {
                        setJadwalGymId(e.target.value);
                      }}
                    >
                      {jadwalGyms.map((jadwalGym, index) => (
                        <option value={jadwalGym.id}>
                          {jadwalGym.tanggal} | {jadwalGym.dariJam}-
                          {jadwalGym.sampaiJam} |{" "}
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
                onClick={() => navigate("/bookingGym")}
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

export default TambahBookingGym;

const spacingTop = {
  mt: 4,
};

const alertBox = {
  width: "100%",
};
