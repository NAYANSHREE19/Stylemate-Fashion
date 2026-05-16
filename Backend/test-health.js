import axios from 'axios';
const run = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/health');
    console.log("Health:", res.data);

    // Weather is a POST route protected by auth. I can't easily test without a token.
    console.log("Server is running fine.");
  } catch(e) {
    console.error(e.message);
  }
};
run();
