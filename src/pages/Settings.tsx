function Settings() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Settings</h1>
      <p>Manage ResQHub system settings.</p>

      <div style={{ marginTop: "30px" }}>
        <h2>System Settings</h2>

        <label>
          <input type="checkbox" defaultChecked />
          Enable emergency notifications
        </label>

        <br /><br />

        <label>
          <input type="checkbox" defaultChecked />
          Enable volunteer notifications
        </label>

        <br /><br />

        <label>
          <input type="checkbox" defaultChecked />
          Enable relief camp alerts
        </label>
      </div>
    </div>
  );
}

export default Settings;