import { useState, useEffect, useContext } from "react";
import {
  Button,
  Spinner,
  Jumbotron,
  Col,
  UncontrolledCollapse,
  Input,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledButtonDropdown,
  Container,
} from "reactstrap";
import { getGeolocalisation } from "../api/vikingApi";
import AppContext from "../Context";

export default function Filtertools({
  getCurrentNetworks,
  busAPI,
  tramAPI,
  metroAPI,
  rerAPI,
  tag,
}) {
  const { setLineDepartGPS, setLineArriveeGPS } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState({});
  const [networks, setNetworks] = useState([]);
  // const [metro, setMetro] = useState([]);
  // const [bus, setBus] = useState([]);
  // const [rer, setRer] = useState([]);
  // const [tram, setTram] = useState([]);
  const [checkMetro, setCheckMetro] = useState(true);
  const [checkBus, setCheckBus] = useState(true);
  const [checkRer, setCheckRer] = useState(true);
  const [checkTram, setCheckTram] = useState(true);
  const [selectedNetwork, setSelectedNetwork] = useState([]);

  const [selectedLine, setSelectedLine] = useState("");

  useEffect(() => {
    try {
      setNetworks(getCurrentNetworks);
      if (tag === "Paris") {
        setCheckMetro(!checkMetro);
        setCheckBus(!checkBus);
        setCheckRer(!checkRer);
        setCheckTram(!checkTram);
      }
      setLoading(!loading);
    } catch (err) {
      setIsError(true);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedLine.length > 0) {
      setLineDepartGPS([]);
      setLineArriveeGPS([]);

      const points = selectedLine.split("/");

      // console.log(points);
      const getDataOne = async () => {
        const pointOne = await getGeolocalisation(points[0]);

        setLineDepartGPS(pointOne.data.features[0].geometry.coordinates);
      };

      const getDataTwo = async () => {
        const pointTwo = await getGeolocalisation(points[1]);

        setLineArriveeGPS(pointTwo.data.features[1].geometry.coordinates);
      };
      getDataOne();
      getDataTwo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLine]);

  const onSelectedLine = (e) => {
    setSelectedLine(e.target.value);
  };

  if (isError) {
    return (
      <Jumbotron fluid>
        <Col fluid>
          <h1 className="display-3">Oups !!!</h1>
          <p className="lead">{error.message}</p>
        </Col>
      </Jumbotron>
    );
  }

  function isCheck(elmt) {
    switch (elmt) {
      case "metro":
        setCheckMetro(!checkMetro);
        setSelectedNetwork(metroAPI.data, "bus");
        break;
      case "bus":
        setCheckBus(!checkBus);
        setSelectedNetwork(busAPI.data);

        break;
      case "rer":
        setCheckRer(!checkRer);
        setSelectedNetwork(rerAPI.data);

        break;
      case "tram":
        setCheckTram(!checkTram);
        setSelectedNetwork(tramAPI.data);

        break;
      default:
        return "error";
    }
  }

  if (checkMetro && tag === "Paris") {
    function getDatas() {
      // setMetro(metroAPI.data);
      setCheckMetro(!checkMetro);
    }
    getDatas();
  }

  if (checkBus) {
    function getDatas() {
      // setBus(busAPI.data);
      setCheckBus(!checkBus);
    }
    getDatas();
  }

  if (checkRer && tag === "Paris") {
    function getDatas() {
      // setRer(rerAPI.data);
      setCheckRer(!checkRer);
    }
    getDatas();
  }

  if (checkTram) {
    function getDatas() {
      // setTram(tramAPI.data);
      setCheckTram(!checkTram);
    }
    getDatas();
  }

  function isReturn(elmt) {
    return selectedNetwork.length === 0 ? null : tag === "Paris" ? (
      <DropdownMenu
        type="select"
        name="selectMulti"
        id="exampleSelectMulti"
        multiple
        onClick={onSelectedLine}
      >
        {selectedNetwork.map((e) => (
          <DropdownItem title={e.name}>{e.name}</DropdownItem>
        ))}
      </DropdownMenu>
    ) : (
      <DropdownMenu
        type="select"
        name="selectMulti"
        id="exampleSelectMulti"
        multiple
      >
        {selectedNetwork.records.map((e) => (
          <DropdownItem title={e.fields.nomarret}>
            {e.fields.nomarret}
          </DropdownItem>
        ))}
      </DropdownMenu>
    );
  }

  return (
    <>
      {loading ? (
        <div>
          <Spinner type="grow" color="primary" className="m-5" />
        </div>
      ) : (
        <Container className="d-flex justify-content-around">
          {networks.map((network) => {
            return (
              <div className="py-1 col-3">
                <UncontrolledButtonDropdown
                  block
                  key={network.id}
                  className="px-2"
                  style={{ width: "150px" }}
                >
                  <DropdownToggle
                    carret
                    className="col-12 border-0 btn-info"
                    color="primary"
                    id={network.name}
                    style={{ marginBottom: "1rem" }}
                    onClick={() => isCheck(network.slug)}
                  >
                    <img
                      src={network.image}
                      alt={network.name}
                      className="rounded-circle"
                      style={{ height: "50px" }}
                    />
                  </DropdownToggle>
                  <>{isReturn("")}</>

                  {/* <UncontrolledCollapse
                    toggler={`#${network.name}`}
                >
                    {isReturn(network.slug)}
                </UncontrolledCollapse> */}
                </UncontrolledButtonDropdown>
              </div>
            );
          })}
        </Container>
      )}
    </>
  );
}
