import HomePage from "../pages/homePage";
export default function UserDashboard({token}) {
    return (
        <div>
            <HomePage token={token} />
        </div>
    );
}