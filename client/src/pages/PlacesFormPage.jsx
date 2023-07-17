import { useEffect, useState } from "react";
import Perks from "../Perks";
import PhotosUploader from "../PhotosUploader";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";

export default function PlacesFormPage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState("");
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/places/" + id).then((response) => {
      const { data } = response;
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkIn);
      setMaxGuests(data.maxGuests);
    });
  }, [id]);

  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  }

  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  async function savePlace(ev) {
    ev.preventDefault();
    const placeData = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
    };
    if (id) {
      // update
      await axios.put("/places", {
        id,
        ...placeData,
      });
      setRedirect(true);
    } else {
      // new place
      await axios.post("/places", placeData);
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }
  return (
    <div>
      <AccountNav />
      <form onSubmit={savePlace}>
        {preInput(
          "Title",
          "Title for your place. Should be short and catchy as in advertisements"
        )}
        <input
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          type="text"
          placeholder="title, for example: my lovely apartment"
        />
        {preInput("Address", "Address to this place")}
        <input
          value={address}
          onChange={(ev) => setAddress(ev.target.value)}
          type="text"
          placeholder="address"
        />
        {preInput("Photos", "more = better")}
        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
        {preInput("Description", "description of the place")}
        <textarea
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        />
        {preInput("Perks", "select all the perks of your place")}
        <Perks selected={perks} onChange={setPerks} />
        <h2 className="text-2xl mt-4">Extra info</h2>
        <p className="text-gray-500 text-sm">house rules, etc</p>
        <textarea
          value={extraInfo}
          onChange={(ev) => setExtraInfo(ev.target.value)}
        />
        <h2 className="text-2xl mt-4">Check in & ou times</h2>
        <p className="text-gray-500 text-sm">
          add check in and ou time, remeber to have some time window for
          cleaning the room
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          <div>
            <h3 className="mt-2 -mb-2">Check in time</h3>
            <input
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
              type="text"
              placeholder="14:00"
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-2">Check out time</h3>
            <input
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
              type="text"
              placeholder="16:00"
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-2">Max number of guests</h3>
            <input
              value={maxGuests}
              onChange={(ev) => setMaxGuests(ev.target.value)}
              type="number"
            />
          </div>
        </div>
        <button className="primary my-4">Save</button>
      </form>
    </div>
  );
}
