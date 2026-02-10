// Campus structure: buildings and rooms
export const campusStructure = {
  name: "Green Valley University",
  buildings: [
    {
      id: "engineering",
      name: "Engineering Block",
      rooms: [
        { id: "eng-lab1", name: "Computer Lab 1" },
        { id: "eng-lab2", name: "Electronics Lab" },
        { id: "eng-lecture1", name: "Lecture Hall A" },
        { id: "eng-lecture2", name: "Lecture Hall B" },
        { id: "eng-office", name: "Faculty Offices" }
      ]
    },
    {
      id: "library",
      name: "Central Library",
      rooms: [
        { id: "lib-reading1", name: "Reading Room 1" },
        { id: "lib-reading2", name: "Reading Room 2" },
        { id: "lib-computer", name: "Computer Zone" },
        { id: "lib-admin", name: "Admin Office" }
      ]
    },
    {
      id: "hostel",
      name: "Student Hostel A",
      rooms: [
        { id: "hostel-floor1", name: "Floor 1 (20 rooms)" },
        { id: "hostel-floor2", name: "Floor 2 (20 rooms)" },
        { id: "hostel-floor3", name: "Floor 3 (20 rooms)" },
        { id: "hostel-common", name: "Common Area" }
      ]
    },
    {
      id: "admin",
      name: "Administration Building",
      rooms: [
        { id: "admin-main", name: "Main Office" },
        { id: "admin-hr", name: "HR Department" },
        { id: "admin-finance", name: "Finance Department" },
        { id: "admin-meeting", name: "Meeting Rooms" }
      ]
    }
  ]
};

export const getAllBuildings = () => campusStructure.buildings;

export const getBuildingById = (buildingId) => 
  campusStructure.buildings.find(b => b.id === buildingId);

export const getRoomsByBuilding = (buildingId) => {
  const building = getBuildingById(buildingId);
  return building ? building.rooms : [];
};
