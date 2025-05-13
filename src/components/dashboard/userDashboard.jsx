import HomePage from "../pages/homePage";
export default function UserDashboard({token, userId}) {
    console.log(token);
    console.log(userId);
    return (
        <div>
            <HomePage token={token} userId={userId} />
        </div>
    );
}