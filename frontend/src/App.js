import { useState } from "react";
import Login from "./Login";
import Events from "./event";

function App() {
  const [userId, setUserId] = useState(null);

  return (
    <>
      {userId ? (
        <Events userId={userId} />
      ) : (
        <Login setUserId={setUserId} />
      )}
    </>
  );
}

export default App;
