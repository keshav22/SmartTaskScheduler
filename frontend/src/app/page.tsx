import { redirect } from "next/navigation";

export default async function HomePage(){
  // internal API to check if the user is logged in
  const isAuthenticated = false; // replace with actual logic

  if (!isAuthenticated){
    redirect("/login");
  }

  return (
    <main>
      <h1>Dashboard - Welcome to Focus Flow</h1>
      <h2>Smart Task Scheduler</h2>
      {/* anything else thats to be added  */}
    </main>
  );
}