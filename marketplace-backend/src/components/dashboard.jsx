const Dashboard = () => {
  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          textAlign: "center",
          padding: "40px",
          background: "white",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h2>Welcome to MegaMart Admin Panel</h2>
        <p>Manage your e-commerce platform from here</p>
      </div>
      <div
        style={{ padding: "20px", background: "white", borderRadius: "8px" }}
      >
        <h2>Quick Links</h2>
        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          <div
            style={{
              flex: 1,
              padding: "20px",
              background: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <h3>👥 Users</h3>
            <p>Manage user accounts</p>
          </div>
          <div
            style={{
              flex: 1,
              padding: "20px",
              background: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <h3>📁 Categories</h3>
            <p>Organize products</p>
          </div>
          <div
            style={{
              flex: 1,
              padding: "20px",
              background: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <h3>🛍️ Products</h3>
            <p>Manage inventory</p>
          </div>
          <div
            style={{
              flex: 1,
              padding: "20px",
              background: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <h3>🛒 Orders</h3>
            <p>Track sales</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
