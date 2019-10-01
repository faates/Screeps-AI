module.exports = {
    run: function(creep){
        
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }
        
        if (creep.memory.working == true) {

            var dropenergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
              filter: (d) => {return (d.resourceType == RESOURCE_ENERGY)}});
              if (dropenergy){
                if (creep.pickup(dropenergy) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(dropenergy)
                }
              }
            
            else {
              var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                  filter: (s) => (s.structureType == STRUCTURE_SPAWN 
                                  || s.structureType == STRUCTURE_EXTENSION 
                                  || s.structureType == STRUCTURE_TOWER)
                                  && s.energy < s.energyCapacity
                                });
                              }
            
                  if (structure != undefined) {
                    if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                      creep.moveTo(structure);
                }
            }
        }
        else {
        if (creep.memory.working == false) {
            
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