function UserTag(props){

    const {name, imgLink} = props
    return(
        <div className="absolute right-0 flex items-center cursor-pointer">
            <img 
            className="w-[75px] rounded-full" 
            src={imgLink} alt=""/>
            <span className="text-white m-[5%] text-xl r">{name}</span>
        </div>
    )
}

export default UserTag;