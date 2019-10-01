var roleBuilder = require('role.builder');

module.exports = {
    run: function(creep) {
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.memory.working == true) {
            var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.hits > s.hitsMax && s.structureType != STRUCTURE_WALL
            });
            
            if (structure != undefined) {
                if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                }
            }
        else {
            
            var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.structureType == (STRUCTURE_CONTAINER 
                                                    || STRUCTURE_STORAGE) 
                                                    && s.store[RESOURCE_ENERGY] > 0
            });

            if (creep.withdraw(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(structure)
                }
            }
        }
    }
};