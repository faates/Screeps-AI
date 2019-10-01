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

            var walls = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_WALL 
            });

            var target = undefined;

            for (let percentage = 0.0001; percentage <= 1; percentage = percentage + 0.0001){
                for (let wall of walls) {
                    if (wall.hits / wall.hitsMax < percentage) {
                        target = wall;
                        break;
                    }
                }

                if (target != undefined) {
                    break;
                }
            }

            if (target != undefined) {
                if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else {
                roleBuilder.run(creep);
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
};