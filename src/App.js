import "./App.css";
import { useState, useEffect, useRef } from "react";
import { Button } from "@material-ui/core";

function useMouse() {
  const [mousePosition, setMousePosition] = useState({
    x: null,
    y: null,
  });
  useEffect(() => {
    function handle(e) {
      setMousePosition({
        x: e.pageX,
        y: e.pageY,
      });
    }

    document.addEventListener("mousemove", handle);
    return () => document.removeEventListener("mousemove", handle);
  });
  return mousePosition;
}

function App() {
  const [needRender, setNeedRender] = useState(false);
  const [start, setStart] = useState(false);
  const [lightOn, setLightOn] = useState(true);
  const [panel2, setPanel2] = useState(false);
  const [panel3, setPanel3] = useState(false);

  const [hasRod, setHasRod] = useState(false);
  const [hasMbox, setHasMbox] = useState(false);
  const [mboxPlayed, setMboxPlayed] = useState(false);

  const [activeElement, setActiveElement] = useState(null);
  const [lastElement, setLastElement] = useState(null);

  const [showNotes, setShowNotes] = useState(false);
  const newNote = useRef(null);
  const [notes, setNotes] = useState([]);

  const { x, y } = useMouse();

  function gameStart() {
    setStart(true);
  }

  function notesList() {
    return (
      <ul id="notes-list">
        {notes.map((note, id) => (
          <li key={id}>{note}</li>
        ))}
      </ul>
    );
  }
  function notesCheck() {
    if (showNotes) {
      return (
        <div id="note-pad">
          <textarea id="new-note" ref={newNote} type="text"></textarea>
          <div>{notesList()}</div>

          <br />
          <button
            id="add-note-btn"
            onClick={() => {
              if (newNote.current.value !== "") {
                notes.push(newNote.current.value);
                setNeedRender(!needRender);
              }
              newNote.current.value = "";
            }}
          >
            +
          </button>
        </div>
      );
    } else {
      return null;
    }
  }

  function panel2Flip(event) {
    event.preventDefault();
    if (event.repeat) {
      return;
    }

    setPanel2(!panel2);
  }
  function panel3Flip(event) {
    event.preventDefault();
    if (event.repeat) {
      return;
    }

    setPanel3(!panel3);
    if (panel2) {
      setPanel2(!panel2);
    }
  }

  function shouldRodBeInScene() {
    if (!hasRod) {
      return (
        <div
          id="rod-box"
          className="item"
          onMouseEnter={() => {
            document.getElementById("rod-box").style.filter = "brightness(60%)";
          }}
          onMouseLeave={() => {
            document.getElementById("rod-box").style.filter = "brightness(15%)";
          }}
        >
          <img
            id="rod"
            alt="small rod"
            className=""
            src="/imgs/rod.gif"
            onClick={() => {
              getRod();
              document.getElementById("rod").classList.add("put-in-pack");
            }}
          />
        </div>
      );
    } else {
      return null;
    }
  }

  function getRod() {
    setHasRod(true);

    document.getElementById("rod-box").style.display = "none";
  }

  function rodCheck() {
    if (hasRod) {
      return (
        <img className="inventory-item" src="/imgs/rod.png" alt="small rod" />
      );
    } else {
      return null;
    }
  }

  function getMbox() {
    setHasMbox(true);
  }
  function shouldMboxBeInScene() {
    if (!hasMbox) {
      return (
        <div
          id="mbox-ground-box"
          className="item"
          onMouseEnter={() => {
            document.getElementById("mbox-ground-box").style.filter =
              "brightness(60%)";
          }}
          onMouseLeave={() => {
            document.getElementById("mbox-ground-box").style.filter =
              "brightness(15%)";
          }}
        >
          <img
            id="mbox-ground"
            className=""
            src="/imgs/musicbox-ground.gif"
            alt="musicbox"
            onClick={() => {
              getMbox();
            }}
          />
        </div>
      );
    } else {
      return null;
    }
  }

  function mBoxCheck() {
    if (hasMbox) {
      return (
        <img
          className="inventory-item mbox-inventory"
          src="/imgs/musicbox-inventory.png"
          alt="musicbox"
        />
      );
    } else {
      return null;
    }
  }

  function itemComboChecks() {
    //item combo checks!!! start

    //small rod and musicbox start
    if (
      hasRod &&
      hasMbox &&
      activeElement != null &&
      activeElement.id === "mbox-inventory-panel" &&
      lastElement != null &&
      lastElement.id === "rod-inventory-panel"
    ) {
      console.log("you added something together!!");
      setMboxPlayed(true);
      setLastElement(null);
      setActiveElement(null);
    } else if (
      hasRod &&
      hasMbox &&
      activeElement != null &&
      activeElement.id === "rod-inventory-panel" &&
      lastElement != null &&
      lastElement.id === "mbox-inventory-panel"
    ) {
      console.log("you added something together!!");

      setMboxPlayed(true);
      setLastElement(null);
      setActiveElement(null);
    }
    //small rod and musicbox end

    //item combo checks!!! end
  }

  function showMboxGif() {
    if (mboxPlayed) {
      return (
        <div className="contextual-box">
          <button
            className="btn context-btn"
            onClick={() => {
              setMboxPlayed(false);
            }}
          >
            <span style={{ transform: "translate(0px,-2px)" }}>&#9746;</span>
          </button>
          <img
            className="contextual-box-img"
            src="/imgs/musicbox.gif"
            alt="musicbox spinning"
          />
        </div>
      );
    } else {
      return null;
    }
  }

  if (!start) {
    //
    //
    //start of App return statement
    return (
      <div className="content-wrap">
        <div>
          <Button variant="contained" color="primary" onClick={gameStart}>
            Begin
          </Button>
        </div>
      </div>
    );
  } else if (!panel2 && !panel3) {
    //panel1 start
    return (
      <div className="content-wrap">
        <img
          className="scene dark1 responsive"
          src="/imgs/scene1-light.gif"
          alt="scene one"
        />
        <img
          id="light"
          className={
            lightOn
              ? "scene light1 responsive"
              : "scene light1 responsive light-off"
          }
          src="/imgs/scene1-light.gif"
          alt="scene 1"
          style={{
            maskPosition: `${x - 165}px ${y - 180}px`,
            WebkitMaskPosition: `${x - 165}px ${y - 180}px`,
          }}
        />

        <p>x:{x}</p>
        <p>y:{y}</p>

        <div
          id="path-el"
          onClick={(event) => {
            panel2Flip(event);
          }}
          onMouseEnter={(event) => {
            document.getElementById("path-text").classList.add("show");
          }}
        >
          <span id="path-text" className="hide icon">
            <svg
              height="80"
              viewBox="0 0 52 60"
              width="100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="Up-Arrow">
                <path
                  id="Shape"
                  d="m.422 48.2 4.4 10.563c.30646207.7489663 1.03576041 1.2379322 1.845 1.237h38.666c.8082203.0026096 1.5377417-.4838697 1.846-1.231 4.9-11.777 4.324-10.43 4.472-10.647.371214-.5410551.4505938-1.2307607.212-1.842l-9-23.143 3.69-8.888c.3796294-.4467605.5389673-1.0401859.4341772-1.6170156-.1047901-.5768296-.4626685-1.0762947-.9751772-1.3609844l-18.992-10.835c-.6292665-.3635455-1.4047335-.3635455-2.034 0l-19.007 10.838c-.51041628.2860644-.86605691.7855074-.96943022 1.3614167-.10337331.5759094.05636658 1.167861.43543022 1.6135833l3.7 8.9-9 23.127c-.25858821.6446969-.15295159 1.3784328.277 1.924zm44.911 9.8h-38.666l-3.748-9h46.162zm-5.633-43h4.376l-2.26 5.443zm-13.677-12.831 18.968 10.831h-5.291c-.6627701-.0061358-1.2855311.316474-1.6628338.8614001-.3773028.5449261-.4601335 1.2413795-.2211662 1.8595999l12.164 31.279h-47.975l12.178-31.28c.238474-.6179412.1555415-1.3138672-.2214702-1.8584618-.3770116-.5445947-.9991938-.8672092-1.6615298-.8615382h-5.284l-.011-.012zm-18.101 12.831h4.4l-2.132 5.461z"
                />
                <path
                  id="Shape"
                  d="m10.605 38.034c-.5332127-.1431788-1.08157088.1728546-1.225.706l-1.346 5c-.14359403.5335071.17249293 1.082406.706 1.226s1.08240597-.1724929 1.226-.706l1.346-5c.0690266-.2563388.0332935-.5296048-.0993245-.7595759-.1326179-.2299712-.351236-.3977725-.6076755-.4664241z"
                />
                <path
                  id="Shape"
                  d="m11.7 33.966c.2562027.0690611.5293493.0334647.7592956-.0989513.2299462-.1324161.397837-.3507938.4667044-.6070487l4.038-15c.143594-.5335071-.172493-1.0824059-.706-1.226-.5335071-.143594-1.082406.1724929-1.226.706l-4.032 15c-.1442267.5317199.1687826 1.0799333.7 1.226z"
                />
                <path
                  id="Shape"
                  d="m8.929 50.628c-.20544993-.5130725-.78792747-.7624499-1.301-.557s-.76244993.7879275-.557 1.301l2 5c.20544993.5130725.78792747.7624499 1.301.557.5130725-.2054499.7624499-.7879275.557-1.301z"
                />
              </g>
            </svg>
          </span>
        </div>
        {/* inventory start */}

        <div id="inventory">
          {/* notes start */}
          {notesCheck()}
          <span
            id="notes-icon"
            style={{
              position: "absolute",

              fontSize: "70px",
              transform: "translate(-60px, 0px)",
              cursor: "pointer",
            }}
            onClick={() => {
              setShowNotes(!showNotes);
            }}
          >
            &#9998;
          </span>
          {/* notes end */}
          <div
            id="rod-inventory-panel"
            className={
              hasRod &&
              hasMbox &&
              activeElement != null &&
              activeElement.id === "mbox-inventory-panel"
                ? "inventory-item-box add-item"
                : "inventory-item-box"
            }
            tabIndex="0"
            onClick={(e) => {
              e.preventDefault();

              setLastElement(activeElement);
              setActiveElement(document.activeElement);
              console.log(activeElement);
            }}
          >
            {rodCheck()}
          </div>
          <div className="inventory-item-box" tabIndex="0"></div>
          <div className="inventory-item-box" tabIndex="0"></div>
          <div className="inventory-item-box" tabIndex="0"></div>
          <div className="inventory-item-box" tabIndex="0"></div>
          <div
            id="mbox-inventory-panel"
            className={
              hasRod &&
              hasMbox &&
              activeElement != null &&
              activeElement.id === "rod-inventory-panel"
                ? "inventory-item-box add-item"
                : "inventory-item-box"
            }
            tabIndex="0"
            onClick={(e) => {
              e.preventDefault();

              setLastElement(activeElement);
              setActiveElement(document.activeElement);
              console.log(activeElement);
            }}
          >
            {mBoxCheck()}
          </div>
          <div className="inventory-item-box" tabIndex="0"></div>
          <div className="inventory-item-box" tabIndex="0"></div>
          <span
            id="flashlight-icon"
            onClick={() => {
              setLightOn(!lightOn);
            }}
          >
            &#128294;
          </span>
        </div>
        {/* inventory end */}
        {itemComboChecks()}
        {showMboxGif()}
      </div>
    );
    //panel 1 end
  } else if (panel2) {
    //panel 2 start
    return (
      <div className="content-wrap">
        <img
          className="scene dark1 responsive"
          src="/imgs/scene2.gif"
          alt="scene two"
        />
        <img
          id="light"
          className={
            lightOn
              ? "scene light1 responsive"
              : "scene light1 responsive light-off"
          }
          src="/imgs/scene2.gif"
          alt="scene two"
          style={{
            maskPosition: `${x - 165}px ${y - 180}px`,
            WebkitMaskPosition: `${x - 165}px ${y - 180}px`,
          }}
        />
        {shouldRodBeInScene()}

        <div
          id="path-el"
          className="back-to-home"
          onClick={(event) => {
            panel2Flip(event);
          }}
          onMouseEnter={(event) => {
            document.getElementById("path-text").classList.add("show");
          }}
          style={{
            transform: "rotate(-90deg) translate(-500px, -500px)",
            width: "100px",
          }}
        >
          <span id="path-text" className="hide icon">
            <svg
              height="80"
              viewBox="0 0 52 60"
              width="100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="Up-Arrow">
                <path
                  id="Shape"
                  d="m.422 48.2 4.4 10.563c.30646207.7489663 1.03576041 1.2379322 1.845 1.237h38.666c.8082203.0026096 1.5377417-.4838697 1.846-1.231 4.9-11.777 4.324-10.43 4.472-10.647.371214-.5410551.4505938-1.2307607.212-1.842l-9-23.143 3.69-8.888c.3796294-.4467605.5389673-1.0401859.4341772-1.6170156-.1047901-.5768296-.4626685-1.0762947-.9751772-1.3609844l-18.992-10.835c-.6292665-.3635455-1.4047335-.3635455-2.034 0l-19.007 10.838c-.51041628.2860644-.86605691.7855074-.96943022 1.3614167-.10337331.5759094.05636658 1.167861.43543022 1.6135833l3.7 8.9-9 23.127c-.25858821.6446969-.15295159 1.3784328.277 1.924zm44.911 9.8h-38.666l-3.748-9h46.162zm-5.633-43h4.376l-2.26 5.443zm-13.677-12.831 18.968 10.831h-5.291c-.6627701-.0061358-1.2855311.316474-1.6628338.8614001-.3773028.5449261-.4601335 1.2413795-.2211662 1.8595999l12.164 31.279h-47.975l12.178-31.28c.238474-.6179412.1555415-1.3138672-.2214702-1.8584618-.3770116-.5445947-.9991938-.8672092-1.6615298-.8615382h-5.284l-.011-.012zm-18.101 12.831h4.4l-2.132 5.461z"
                />
                <path
                  id="Shape"
                  d="m10.605 38.034c-.5332127-.1431788-1.08157088.1728546-1.225.706l-1.346 5c-.14359403.5335071.17249293 1.082406.706 1.226s1.08240597-.1724929 1.226-.706l1.346-5c.0690266-.2563388.0332935-.5296048-.0993245-.7595759-.1326179-.2299712-.351236-.3977725-.6076755-.4664241z"
                />
                <path
                  id="Shape"
                  d="m11.7 33.966c.2562027.0690611.5293493.0334647.7592956-.0989513.2299462-.1324161.397837-.3507938.4667044-.6070487l4.038-15c.143594-.5335071-.172493-1.0824059-.706-1.226-.5335071-.143594-1.082406.1724929-1.226.706l-4.032 15c-.1442267.5317199.1687826 1.0799333.7 1.226z"
                />
                <path
                  id="Shape"
                  d="m8.929 50.628c-.20544993-.5130725-.78792747-.7624499-1.301-.557s-.76244993.7879275-.557 1.301l2 5c.20544993.5130725.78792747.7624499 1.301.557.5130725-.2054499.7624499-.7879275.557-1.301z"
                />
              </g>
            </svg>
          </span>
        </div>
        <div
          id="path-el"
          className="to-cave-entrance"
          style={{
            width: "fit-content",
            height: "fit-content",
            transform: "rotate(90deg)",
          }}
          onClick={(event) => {
            panel3Flip(event);
          }}
          onMouseEnter={(event) => {
            document.getElementById("path-text").classList.add("show");
          }}
        >
          <span id="path-text" className="icon">
            <svg
              height="80"
              viewBox="0 0 52 60"
              width="100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="Up-Arrow">
                <path
                  id="Shape"
                  d="m.422 48.2 4.4 10.563c.30646207.7489663 1.03576041 1.2379322 1.845 1.237h38.666c.8082203.0026096 1.5377417-.4838697 1.846-1.231 4.9-11.777 4.324-10.43 4.472-10.647.371214-.5410551.4505938-1.2307607.212-1.842l-9-23.143 3.69-8.888c.3796294-.4467605.5389673-1.0401859.4341772-1.6170156-.1047901-.5768296-.4626685-1.0762947-.9751772-1.3609844l-18.992-10.835c-.6292665-.3635455-1.4047335-.3635455-2.034 0l-19.007 10.838c-.51041628.2860644-.86605691.7855074-.96943022 1.3614167-.10337331.5759094.05636658 1.167861.43543022 1.6135833l3.7 8.9-9 23.127c-.25858821.6446969-.15295159 1.3784328.277 1.924zm44.911 9.8h-38.666l-3.748-9h46.162zm-5.633-43h4.376l-2.26 5.443zm-13.677-12.831 18.968 10.831h-5.291c-.6627701-.0061358-1.2855311.316474-1.6628338.8614001-.3773028.5449261-.4601335 1.2413795-.2211662 1.8595999l12.164 31.279h-47.975l12.178-31.28c.238474-.6179412.1555415-1.3138672-.2214702-1.8584618-.3770116-.5445947-.9991938-.8672092-1.6615298-.8615382h-5.284l-.011-.012zm-18.101 12.831h4.4l-2.132 5.461z"
                />
                <path
                  id="Shape"
                  d="m10.605 38.034c-.5332127-.1431788-1.08157088.1728546-1.225.706l-1.346 5c-.14359403.5335071.17249293 1.082406.706 1.226s1.08240597-.1724929 1.226-.706l1.346-5c.0690266-.2563388.0332935-.5296048-.0993245-.7595759-.1326179-.2299712-.351236-.3977725-.6076755-.4664241z"
                />
                <path
                  id="Shape"
                  d="m11.7 33.966c.2562027.0690611.5293493.0334647.7592956-.0989513.2299462-.1324161.397837-.3507938.4667044-.6070487l4.038-15c.143594-.5335071-.172493-1.0824059-.706-1.226-.5335071-.143594-1.082406.1724929-1.226.706l-4.032 15c-.1442267.5317199.1687826 1.0799333.7 1.226z"
                />
                <path
                  id="Shape"
                  d="m8.929 50.628c-.20544993-.5130725-.78792747-.7624499-1.301-.557s-.76244993.7879275-.557 1.301l2 5c.20544993.5130725.78792747.7624499 1.301.557.5130725-.2054499.7624499-.7879275.557-1.301z"
                />
              </g>
            </svg>
          </span>
        </div>
        {/* inventory start */}
        <div id="inventory">
          {/* notes start */}
          {notesCheck()}
          <span
            id="notes-icon"
            style={{
              position: "absolute",

              fontSize: "70px",
              transform: "translate(-60px, 0px)",
              cursor: "pointer",
            }}
            onClick={() => {
              setShowNotes(!showNotes);
            }}
          >
            &#9998;
          </span>
          {/* notes end */}
          <div
            id="rod-inventory-panel"
            className={
              hasRod &&
              hasMbox &&
              activeElement != null &&
              activeElement.id === "mbox-inventory-panel"
                ? "inventory-item-box add-item"
                : "inventory-item-box"
            }
            tabIndex="0"
            onClick={(e) => {
              e.preventDefault();

              setLastElement(activeElement);
              setActiveElement(document.activeElement);
              console.log(activeElement);
            }}
          >
            {rodCheck()}
          </div>
          <div className="inventory-item-box" tabIndex="0"></div>
          <div className="inventory-item-box" tabIndex="0"></div>
          <div className="inventory-item-box" tabIndex="0"></div>
          <div className="inventory-item-box" tabIndex="0"></div>
          <div
            id="mbox-inventory-panel"
            className={
              hasRod &&
              hasMbox &&
              activeElement != null &&
              activeElement.id === "rod-inventory-panel"
                ? "inventory-item-box add-item"
                : "inventory-item-box"
            }
            tabIndex="0"
            onClick={(e) => {
              e.preventDefault();

              setLastElement(activeElement);
              setActiveElement(document.activeElement);
              console.log(activeElement);
            }}
          >
            {mBoxCheck()}
          </div>
          <div className="inventory-item-box" tabIndex="0"></div>
          <div className="inventory-item-box" tabIndex="0"></div>
          <span
            id="flashlight-icon"
            onClick={() => {
              setLightOn(!lightOn);
            }}
          >
            &#128294;
          </span>
        </div>
        {/* inventory end */}
        {itemComboChecks()}
        {showMboxGif()}
      </div>
    );
  } else if (panel3) {
    //start panel 3
    return (
      <div className="content-wrap">
        <img
          className="scene dark1 responsive"
          src="/imgs/cave1-entrance.gif"
          alt="scene"
        />
        <img
          id="light"
          className={
            lightOn
              ? "scene light1 responsive"
              : "scene light1 responsive light-off"
          }
          src="/imgs/cave1-entrance.gif"
          alt="scene"
          style={{
            maskPosition: `${x - 165}px ${y - 180}px`,
            WebkitMaskPosition: `${x - 165}px ${y - 180}px`,
          }}
        />

        <div
          id="path-el"
          className="back-left"
          style={{
            width: "fit-content",
            height: "fit-content",
            transform: "rotate(-90deg)",
          }}
          onClick={(event) => {
            panel3Flip(event);
            panel2Flip(event);
          }}
          onMouseEnter={(event) => {
            document.getElementById("path-text").classList.add("show");
          }}
        >
          <span id="path-text" className="icon">
            <svg
              height="80"
              viewBox="0 0 52 60"
              width="100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="Up-Arrow">
                <path
                  id="Shape"
                  d="m.422 48.2 4.4 10.563c.30646207.7489663 1.03576041 1.2379322 1.845 1.237h38.666c.8082203.0026096 1.5377417-.4838697 1.846-1.231 4.9-11.777 4.324-10.43 4.472-10.647.371214-.5410551.4505938-1.2307607.212-1.842l-9-23.143 3.69-8.888c.3796294-.4467605.5389673-1.0401859.4341772-1.6170156-.1047901-.5768296-.4626685-1.0762947-.9751772-1.3609844l-18.992-10.835c-.6292665-.3635455-1.4047335-.3635455-2.034 0l-19.007 10.838c-.51041628.2860644-.86605691.7855074-.96943022 1.3614167-.10337331.5759094.05636658 1.167861.43543022 1.6135833l3.7 8.9-9 23.127c-.25858821.6446969-.15295159 1.3784328.277 1.924zm44.911 9.8h-38.666l-3.748-9h46.162zm-5.633-43h4.376l-2.26 5.443zm-13.677-12.831 18.968 10.831h-5.291c-.6627701-.0061358-1.2855311.316474-1.6628338.8614001-.3773028.5449261-.4601335 1.2413795-.2211662 1.8595999l12.164 31.279h-47.975l12.178-31.28c.238474-.6179412.1555415-1.3138672-.2214702-1.8584618-.3770116-.5445947-.9991938-.8672092-1.6615298-.8615382h-5.284l-.011-.012zm-18.101 12.831h4.4l-2.132 5.461z"
                />
                <path
                  id="Shape"
                  d="m10.605 38.034c-.5332127-.1431788-1.08157088.1728546-1.225.706l-1.346 5c-.14359403.5335071.17249293 1.082406.706 1.226s1.08240597-.1724929 1.226-.706l1.346-5c.0690266-.2563388.0332935-.5296048-.0993245-.7595759-.1326179-.2299712-.351236-.3977725-.6076755-.4664241z"
                />
                <path
                  id="Shape"
                  d="m11.7 33.966c.2562027.0690611.5293493.0334647.7592956-.0989513.2299462-.1324161.397837-.3507938.4667044-.6070487l4.038-15c.143594-.5335071-.172493-1.0824059-.706-1.226-.5335071-.143594-1.082406.1724929-1.226.706l-4.032 15c-.1442267.5317199.1687826 1.0799333.7 1.226z"
                />
                <path
                  id="Shape"
                  d="m8.929 50.628c-.20544993-.5130725-.78792747-.7624499-1.301-.557s-.76244993.7879275-.557 1.301l2 5c.20544993.5130725.78792747.7624499 1.301.557.5130725-.2054499.7624499-.7879275.557-1.301z"
                />
              </g>
            </svg>
          </span>
        </div>
        {shouldMboxBeInScene()}
        {/* inventory start */}
        <div id="inventory">
          {/* notes start */}
          {notesCheck()}
          <span
            id="notes-icon"
            style={{
              position: "absolute",

              fontSize: "70px",
              transform: "translate(-60px, 0px)",
              cursor: "pointer",
            }}
            onClick={() => {
              setShowNotes(!showNotes);
            }}
          >
            &#9998;
          </span>
          {/* notes end */}
          <div
            id="rod-inventory-panel"
            className={
              hasRod &&
              hasMbox &&
              activeElement != null &&
              activeElement.id === "mbox-inventory-panel"
                ? "inventory-item-box add-item"
                : "inventory-item-box"
            }
            tabIndex="0"
            onClick={(e) => {
              e.preventDefault();

              setLastElement(activeElement);
              setActiveElement(document.activeElement);
              console.log(activeElement);
            }}
          >
            {rodCheck()}
          </div>
          <div className="inventory-item-box" tabIndex="0"></div>
          <div className="inventory-item-box" tabIndex="0"></div>
          <div className="inventory-item-box" tabIndex="0"></div>
          <div className="inventory-item-box" tabIndex="0"></div>
          <div
            id="mbox-inventory-panel"
            className={
              hasRod &&
              hasMbox &&
              activeElement != null &&
              activeElement.id === "rod-inventory-panel"
                ? "inventory-item-box add-item"
                : "inventory-item-box"
            }
            tabIndex="0"
            onClick={(e) => {
              e.preventDefault();

              setLastElement(activeElement);
              setActiveElement(document.activeElement);
              console.log(activeElement);
            }}
          >
            {mBoxCheck()}
          </div>
          <div className="inventory-item-box" tabIndex="0"></div>
          <div className="inventory-item-box" tabIndex="0"></div>
          <span
            id="flashlight-icon"
            onClick={() => {
              setLightOn(!lightOn);
            }}
          >
            &#128294;
          </span>
        </div>
        {/* inventory end */}
        {itemComboChecks()}
        {showMboxGif()}
      </div>
    );
  }
  //panel 3 end
}

export default App;
