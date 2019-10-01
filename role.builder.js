var roleUpgrader = require('role.upgrader');

module.exports = {
    run: function(creep) {
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.memory.working == true) {
            var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (constructionSite != undefined) {
                if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSite);
                }
            }
            else {
                roleUpgrader.run(creep);
            }
        }

        //Use this when you have sufficient containers AND CREEPS THAT WILL MAINTAIN THEM
        //without repairers keeping containers in check, the colony could collapse
        //else {
            
            //var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                //filter: (s) => s.structureType == (STRUCTURE_CONTAINER 
                                                    //|| STRUCTURE_STORAGE) 
                                                    //&& s.store[RESOURCE_ENERGY] > 0
            //});

            //if (creep.withdraw(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                //creep.moveTo(structure)
            //}
        //}

        // use this when you dont have containers yet
        else {
            var source = creep.pos.findClosestByPath(FIND_SOURCES)
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source)
            }
        }
        
    }
};