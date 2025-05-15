import HomePage from "../pages/homePage";
export default function UserDashboard({token, userId}) {
    return (
        <div>
            <HomePage token={token} userId={userId} />
        </div>
    );
}