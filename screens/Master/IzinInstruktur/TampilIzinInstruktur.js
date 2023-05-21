import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { ShowTableIzinInstruktur } from "../../../components/ShowTable";
import { FetchErrorHandling } from "../../../components/FetchErrorHandling";
import {
  SearchBar,
  Loader,
  usePagination,
  ButtonModifier
} from "../../../components";
import { Container, Form, Row, Col } from "react-native-bootstrap";
import { Box, Pagination, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const TampilIzinInstruktur = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [dariJam, setDariJam] = useState("");
  const [sampaiJam, setSampaiJam] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [tanggalDate, setTanggalDate] = useState("");
  const [member, setMember] = useState("");
  const [memberId, setMemberId] = useState("");
  const [userId, setUserId] = useState("");
  const [absensi, setAbsensi] = useState("");
  const [konfirmasi, setKonfirmasi] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [izinInstrukturs, setIzinInstrukturs] = useState([]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = izinInstrukturs.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.jadwalinstruktur.dariJam
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.jadwalinstruktur.sampaiJam
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.tanggal.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.user.username.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.absensi.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.konfirmasi.toUpperCase().includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(izinInstrukturs, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getIzinInstrukturs();
    id && getIzinInstrukturById();
  }, [id]);

  const getIzinInstrukturs = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${tempUrl}/izinInstruktur`, {
        _id: user.id,
        token: user.token
      });
      setIzinInstrukturs(response.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getIzinInstrukturById = async () => {
    if (id) {
      const response = await axios.post(`${tempUrl}/izinInstruktur/${id}`, {
        _id: user.id,
        token: user.token
      });
      setDariJam(response.data.jadwalinstruktur.dariJam);
      setSampaiJam(response.data.jadwalinstruktur.sampaiJam);
      let newTanggal = new Date(response.data.jadwalinstruktur.tanggal);
      let tempTanggal = `${newTanggal.getDate().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      })}-${(newTanggal.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      })}-${newTanggal.getFullYear()}`;
      setTanggal(tempTanggal);
      setTanggalDate(response.data.jadwalinstruktur.tanggal);
      setMember(response.data.user.username);
      setMemberId(response.data.jadwalinstruktur.id);
      setUserId(response.data.user.id);
      setAbsensi(response.data.absensi);
      setKonfirmasi(response.data.konfirmasi);
    }
  };

  const konfirmasiIzinInstruktur = async (e) => {
    setLoading(true);
    try {
      setLoading(true);
      await axios.post(`${tempUrl}/konfirmasiIzinInstruktur/${id}`, {
        jadwalInstrukturId: memberId,
        userId,
        _id: user.id,
        token: user.token
      });
      setLoading(false);
      navigate(`/izinInstruktur`);
    } catch (error) {
      alert(error);
    }
    setLoading(false);
  };

  const deleteIzinInstruktur = async (id) => {
    setLoading(true);
    try {
      await axios.post(`${tempUrl}/deleteIzinInstruktur/${id}`, {
        jadwalInstrukturId: memberId,
        userId,
        _id: user.id,
        token: user.token
      });
      getIzinInstrukturs();
      setDariJam("");
      setSampaiJam("");
      setTanggal("");
      setTanggalDate("");
      setMember("");
      setAbsensi("");
      setKonfirmasi("");
      navigate("/izinInstruktur");
    } catch (error) {
      if (error.response.data.message.includes("foreign key")) {
        alert(`${member} tidak bisa dihapus karena sudah ada data!`);
      }
    }
    setLoading(false);
  };

  const textRight = {
    textAlign: screenSize >= 650 && "right"
  };

  if (loading) {
    return <Loader />;
  }

  if (isFetchError) {
    return <FetchErrorHandling />;
  }

  return (
    <Container>
      <Input>Master</Input>
      <Input style={{ fontWeight: 400 }}>Daftar Izin Instruktur</Input>
      <Box sx={buttonModifierContainer}>
        <ButtonModifier
          id={id}
          kode={id}
          addLink={`/izinInstruktur/tambahIzinInstruktur`}
          editLink={null}
          deleteUser={deleteIzinInstruktur}
          nameUser={member}
        />
        {id && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            sx={{ textTransform: "none" }}
            onClick={() => {
              konfirmasiIzinInstruktur();
            }}
          >
            Konfirmasi
          </Button>
        )}
      </Box>
      {id && (
        <Container>
          <hr />
          <Form>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Dari Jam :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={dariJam} disabled readOnly />
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
                    Sampai Jam :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={sampaiJam} disabled readOnly />
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
                    Tanggal :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={tanggal} disabled readOnly />
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
                    Instruktur :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={member} disabled readOnly />
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
                    Absensi :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={absensi === true ? "MASUK" : "IZIN"}
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
                    Konfirmasi :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={konfirmasi === true ? "TERKONFIRMASI" : "BELUM"}
                      disabled
                      readOnly
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Container>
      )}
      <hr />
      <Box sx={searchBarContainer}>
        <SearchBar setSearchTerm={setSearchTerm} />
      </Box>
      <Box sx={tableContainer}>
        <ShowTableIzinInstruktur
          currentPosts={currentPosts}
          searchTerm={searchTerm}
        />
      </Box>
      <Box sx={tableContainer}>
        <Pagination
          count={count}
          page={page}
          onChange={handleChange}
          color="primary"
          size={screenSize <= 600 ? "small" : "large"}
        />
      </Box>
    </Container>
  );
};

export default TampilIzinInstruktur;

const buttonModifierContainer = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center"
};

const searchBarContainer = {
  pt: 6,
  display: "flex",
  justifyContent: "center"
};

const tableContainer = {
  pt: 4,
  display: "flex",
  justifyContent: "center"
};
