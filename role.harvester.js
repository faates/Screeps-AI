module.exports = {
    run: function(creep){
        
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }
        
        if (creep.memory.working == true) {
            
            var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => ((s.structureType == STRUCTURE_STORAGE
                                || s.structureType == STRUCTURE_CONTAINER)
                                && s.store[RESOURCE_ENERGY] < s.storeCapacity) 
                                ||
                                ((s.structureType == STRUCTURE_SPAWN
                                    || s.structureType == STRUCTURE_EXTENSION
                                    || s.structureType == STRUCTURE_TOWER)
                                && s.energy < s.energyCapacity)
            });
            
            if (structure != undefined) {
                if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                }
            }

        }
        else {
            var source = creep.pos.findClosestByPath(FIND_SOURCES)
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source)
            }
        }
    }
};