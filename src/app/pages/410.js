export default function GonePage() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>410 - Page Gone</h1>
      <p>This page has been permanently removed.</p>
    </div>
  );
}
// Force HTTP status code 410
export async function getServerSideProps({ res }) {
  res.statusCode = 410;
  return { props: {} };
}