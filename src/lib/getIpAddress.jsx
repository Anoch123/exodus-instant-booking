export async function getIpAddress() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip;
  } catch (err) {
    console.error("Failed to get IP address", err);
    return null;
  }
}
