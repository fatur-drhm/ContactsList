import { useState, useEffect } from "react";
import List from "./List";
import "./app.css";
import { uid } from "uid";
import axios from "axios";

function App() {
  const [contacts, setContacts] = useState([]);

  const [isUpdate, setIsUpdate] = useState({ id: null, status: false });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    //mengambil Data
    axios.get("http://localhost:3000/contacts").then((res) => {
      setContacts(res?.data ?? []);
    });
  }, []);

  function handleChange(e) {
    let data = { ...formData };
    data[e.target.name] = e.target.value;
    setFormData(data);
  }

  function handleSubmit(e) {
    e.preventDefault();

    let data = [...contacts];

    if (formData.name === "") {
      return false;
    }

    if (formData.phone === "") {
      return false;
    }

    if (isUpdate.status) {
      data.forEach((contact) => {
        if (contact.id === isUpdate.id) {
          contact.name = formData.name;
          contact.phone = formData.phone;
        }
      });

      axios
        .put(`http://localhost:3000/contacts/${isUpdate.id}`, {
          name: formData.name,
          phone: formData.phone,
        })
        .then((res) => {
          alert("Berhasil megedit data");
        });
    } else {
      let newData = { id: uid(), name: formData.name, phone: formData.phone };
      data.push(newData);

      axios.post("http://localhost:3000/contacts", newData).then((res) => {
        alert("berhasil menyimpan data");
      });
    }
    setIsUpdate({ id: null, status: false });
    setContacts(data);
    setFormData({ name: "", phone: "" });
  }

  function handleEdit(id) {
    let data = [...contacts];
    let foundData = data.find((contact) => contact.id === id);
    setFormData({ name: foundData.name, phone: foundData.phone });

    setIsUpdate({ id: id, status: true });
  }

  function handleDelete(id) {
    let data = [...contacts];
    let filteredData = data.filter((contact) => contact.id !== id);

    axios.delete(`http://localhost:3000/contacts/${id}`).then((res) => {
      alert("Berhasil Mengahpus Data");
    });

    setContacts(filteredData);
  }

  return (
    <>
      <div className="container w-screen justify-items-center">
        <div>
          <h1>CONTACT LIST </h1>
        </div>
        <form className="m-5" onSubmit={handleSubmit}>
          <label className="form-control w-screen max-w-xs mt-5">
            <div className="label">
              <span className="label-text">Nama</span>
            </div>
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
              </svg>
              <input
                type="text"
                className="grow"
                placeholder="Username"
                value={formData.name}
                onChange={handleChange}
                name="name"
              />
            </label>
          </label>
          <label className="form-control w-screen max-w-xs mt-5">
            <div className="label">
              <span className="label-text">Nomor Telepon</span>
            </div>
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4 opacity-70">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                />
              </svg>
              <input
                type="text"
                className="grow"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                name="phone"
              />
            </label>
          </label>
          <div>
            <button className="btn btn-accent form-control w-screen max-w-xs mt-5">
              Save
            </button>
          </div>
        </form>

        <List
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          data={contacts}
        />
      </div>
    </>
  );
}

export default App;
