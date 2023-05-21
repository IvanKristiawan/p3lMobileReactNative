import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { ShowTableBookingKelas } from "../../../components/ShowTable";
import { FetchErrorHandling } from "../../../components/FetchErrorHandling";
import {
  SearchBar,
  Loader,
  usePagination,
  ButtonModifier,
} from "../../../components";
import { Container, Form, Row, Col } from "react-native-bootstrap";
import { Box, Pagination, Button, ButtonGroup } from "@mui/material";
import jsPDF from "jspdf";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";

const TampilBookingKelas = () => {
  const reportTemplateRef = useRef(null);
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [noBooking, setNoBooking] = useState("");
  const [dariJam, setDariJam] = useState("");
  const [sampaiJam, setSampaiJam] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [tanggalDate, setTanggalDate] = useState("");
  const [member, setMember] = useState("");
  const [absensi, setAbsensi] = useState("");
  const [harga, setHarga] = useState("");
  const [masaAktif, setMasaAktif] = useState("");
  const [namaKelas, setNamaKelas] = useState("");
  const [namaInstruktur, setNamaInstruktur] = useState("");
  const [deposit, setDeposit] = useState("");
  const [previewPdf, setPreviewPdf] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [bookingGyms, setBookingGyms] = useState([]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = bookingGyms.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.noBooking.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.jadwalinstruktur.dariJam
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.jadwalinstruktur.sampaiJam
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.tanggal.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.user.username.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.absensi.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.jadwalinstruktur.harga == searchTerm
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(bookingGyms, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  const handleGeneratePdf = () => {
    const doc = new jsPDF({
      format: "a4",
      unit: "px",
    });

    doc.html(reportTemplateRef.current, {
      async callback(doc) {
        await doc.save("StrukBookingKelas");
      },
      html2canvas: { scale: 0.5 },
    });
  };

  useEffect(() => {
    getBookingKelass();
    id && getBookingKelasById();
  }, [id]);

  const getBookingKelass = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${tempUrl}/bookingKelas`, {
        _id: user.id,
        token: user.token,
      });
      setBookingGyms(response.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getBookingKelasById = async () => {
    if (id) {
      const response = await axios.post(`${tempUrl}/bookingKelas/${id}`, {
        _id: user.id,
        token: user.token,
      });
      setNoBooking(response.data.noBooking);
      setDariJam(response.data.jadwalinstruktur.dariJam);
      setSampaiJam(response.data.jadwalinstruktur.sampaiJam);
      let newTanggal = new Date(response.data.jadwalinstruktur.tanggal);
      let tempTanggal = `${newTanggal.getDate().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })}-${(newTanggal.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })}-${newTanggal.getFullYear()}`;
      setTanggal(tempTanggal);
      setTanggalDate(response.data.jadwalinstruktur.tanggal);
      setMember(response.data.user.username);
      setAbsensi(response.data.absensi);
      setHarga(response.data.jadwalinstruktur.harga);
      setNamaKelas(response.data.jadwalinstruktur.namaKelas);
      setNamaInstruktur(response.data.jadwalinstruktur.user.username);

      const aktivasiUser = await axios.post(`${tempUrl}/aktivasisByUser`, {
        userId: response.data.user.id,
        _id: user.id,
        token: user.token,
      });
      setMasaAktif(aktivasiUser.data.masaAktif);

      const findUser = await axios.post(
        `${tempUrl}/findUser/${response.data.user.id}`,
        {
          _id: user.id,
          token: user.token,
        }
      );
      setDeposit(findUser.data.deposit);
    }
  };

  const presensiBookingKelas = async (e) => {
    setLoading(true);
    try {
      setLoading(true);
      await axios.post(`${tempUrl}/presensiBookingKelas/${id}`, {
        _id: user.id,
        token: user.token,
      });
      setLoading(false);
      navigate(`/bookingKelas`);
    } catch (error) {
      alert(error);
    }
    setLoading(false);
  };

  function subsDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  }

  const deleteBookingKelas = async (id) => {
    setLoading(true);
    let tempToday = new Date();
    let ifAktif = new Date(masaAktif) > new Date();
    let lessThanHMin1 = new Date(tanggalDate) < subsDays(tempToday, 1);
    if (ifAktif && lessThanHMin1) {
      try {
        await axios.post(`${tempUrl}/deleteBookingKelas/${id}`, {
          _id: user.id,
          token: user.token,
        });
        getBookingKelass();
        setDariJam("");
        setSampaiJam("");
        setTanggal("");
        setTanggalDate("");
        setMember("");
        setAbsensi("");
        setHarga("");
        navigate("/bookingKelas");
      } catch (error) {
        if (error.response.data.message.includes("foreign key")) {
          alert(`${member} tidak bisa dihapus karena sudah ada data!`);
        }
      }
    } else {
      alert("Tidak bisa dibatalkan karena melebih H-1!");
    }
    setLoading(false);
  };

  const textRight = {
    textAlign: screenSize >= 650 && "right",
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
      <Input style={{ fontWeight: 400 }}>Daftar Booking Kelas</Input>
      <Box sx={buttonModifierContainer}>
        <ButtonModifier
          id={id}
          kode={id}
          addLink={`/bookingkelas/tambahBookingKelas`}
          editLink={null}
          deleteUser={deleteBookingKelas}
          nameUser={member}
        />
        {id && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            sx={{ textTransform: "none" }}
            onClick={() => {
              presensiBookingKelas();
            }}
          >
            Presensi Masuk
          </Button>
        )}
      </Box>
      {id && (
        <Box sx={downloadButtons}>
          <ButtonGroup variant="outlined" color="secondary">
            <Button
              color="primary"
              startIcon={<SearchIcon />}
              onClick={() => {
                setPreviewPdf(!previewPdf);
              }}
            >
              PDF
            </Button>
          </ButtonGroup>
        </Box>
      )}
      {previewPdf && (
        <>
          <div>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handleGeneratePdf}
            >
              CETAK
            </Button>
          </div>
          <div ref={reportTemplateRef} style={cetakContainer}>
            <p>GoFit</p>
            <p>Jl. Centralpark No. 10 Yogyakarta</p>
            <p style={cetakCenter}>Struk Booking Kelas</p>
            <p style={cetakCenter}>No. Booking: {noBooking}</p>
            <p style={cetakCenter}>Tanggal: {tanggal}</p>
            <p style={cetakCenter}>Member: {member}</p>
            <p style={cetakCenter}>Kelas: {namaKelas}</p>
            <p style={cetakCenter}>Instruktur: {namaInstruktur}</p>
            <p style={cetakCenter}>Harga: {harga.toLocaleString()}</p>
            <p style={cetakCenter}>Sisa: {deposit.toLocaleString()}</p>
          </div>
        </>
      )}
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
                    No. Booking :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={noBooking} disabled readOnly />
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
                    Member :
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
                      value={absensi === true ? "DATANG" : "ABSEN"}
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
                    Harga :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={harga.toLocaleString()}
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
        <ShowTableBookingKelas
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

export default TampilBookingKelas;

const buttonModifierContainer = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
};

const searchBarContainer = {
  pt: 6,
  display: "flex",
  justifyContent: "center",
};

const tableContainer = {
  pt: 4,
  display: "flex",
  justifyContent: "center",
};

const downloadButtons = {
  mt: 4,
  mb: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
};

const cetakContainer = {
  width: "300px",
  fontSize: "16px",
  letterSpacing: "0.01px",
};

const cetakCenter = {
  textAlign: "center",
  marginTop: "0px",
  marginBottom: "0px",
};
