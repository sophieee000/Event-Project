import { useEffect, useState } from "react";

export default function Events({ userId }) {
  const [events, setEvents] = useState([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/events/${userId}`)
      .then(res => res.json())
      .then(setEvents);
  }, [userId]);

  const addEvent = async () => {
    const res = await fetch("http://localhost:5000/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, location, userId })
    });

    const newEvent = await res.json();
    setEvents([...events, newEvent]);
  };

  const deleteEvent = async id => {
    await fetch(`http://localhost:5000/events/${id}`, {
      method: "DELETE"
    });
    setEvents(events.filter(e => e._id !== id));
  };

  return (
    <div>
      <h2>My Events</h2>

      <input placeholder="Event name" onChange={e => setName(e.target.value)} />
      <input placeholder="Location" onChange={e => setLocation(e.target.value)} />
      <button onClick={addEvent}>Add Event</button>

      <ul>
        {events.map(e => (
          <li key={e._id}>
            {e.name} — {e.location}
            <button onClick={() => deleteEvent(e._id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}