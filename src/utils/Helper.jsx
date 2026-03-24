import tanks from "../data/Tank";

const getTankModal = (tankId) => {
    const modal = tanks.find((tank) => tank.id === tankId).modal;
    const imgModalTank = new Image();
    imgModalTank.src = modal;
    return imgModalTank;
}
const getSkillDescription = (tankId, skillId) => {
    const skillDescription = skillDescriptions.find((skill) => skill.id === skillId).description;
    return skillDescription;
}




export { getTankModal };
