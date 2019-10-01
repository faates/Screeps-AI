//yeeyee
// import modules
require('prototype.spawn')();
var roleHarvester = require('role.harvester');
var roleHauler = require('role.hauler');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleWallRepairer = require('role.wallRepairer');

var HOME = 'W21S24';

module.exports.loop = function () {
    // check for memory entries of died creeps by iterating over Memory.creeps
    for (let name in Memory.creeps) {
        // and checking if the creep is still alive
        if (Game.creeps[name] == undefined) {
            // if not, delete the memory entry
            delete Memory.creeps[name];
        }
    }

    // for every creep name in Game.creeps
    for (let name in Game.creeps) {
        // get the creep object
        var creep = Game.creeps[name];

        // if creep is harvester, call harvester script
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }

        else if (creep.memory.role == 'hauler') {
            roleHauler.run(creep);
        }

        // if creep is upgrader, call upgrader script
        else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        // if creep is builder, call builder script
        else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        // if creep is repairer, call repairer script
        else if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        // if creep is wallRepairer, call wallRepairer script
        else if (creep.memory.role == 'wallRepairer') {
            roleWallRepairer.run(creep);
        }
    }

    // find all towers
    var towers = Game.rooms[HOME].find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_TOWER
    });
    // for each tower
    for (let tower of towers) {
        // find closes hostile creep
        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        // if one is found...
        if (target != undefined) {
            // ...FIRE!
            tower.attack(target);
        }
    }

    // setup some minimum numbers for different roles
    var minimumNumberOfHarvesters = 3;
    var minimumNumberOfHaulers = 2;
    var minimumNumberOfUpgraders = 1;
    var minimumNumberOfBuilders = 3;
    var minimumNumberOfRepairers = 2;
    var minimumNumberOfWallRepairers = 1;

    // count the number of creeps alive for each role
    var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
    var numberOfHaulers = _.sum(Game.creeps, (c) => c.memory.role == 'hauler');
    var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
    var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
    var numberOfRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'repairer');
    var numberOfWallRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'wallRepairer');

    var energy = Game.spawns['Spawn1'].room.energyCapacityAvailable;
    var name = undefined;

    // if not enough harvesters
    if (numberOfHarvesters < minimumNumberOfHarvesters) {
        // try to spawn one
        name = Game.spawns['Spawn1'].createCustomCreep(energy, 'harvester');

        // if spawning failed and we have no harvesters left
        if (name == ERR_NOT_ENOUGH_ENERGY && numberOfHarvesters < 2) {
            // spawn one with what is available
            name = Game.spawns['Spawn1'].createCustomCreep(
                Game.spawns['Spawn1'].room.energyAvailable, 'harvester');
        }
    }

    // if not enough builders
    else if (numberOfBuilders < minimumNumberOfBuilders) {
        // try to spawn one
        name = Game.spawns['Spawn1'].createCustomCreep(energy, 'builder');
    }

    else if (numberOfHaulers < minimumNumberOfHaulers) {
    // try to spawn one
    name = Game.spawns['Spawn1'].createCustomCreep(energy, 'hauler');
    }

    // if not enough upgraders
    else if (numberOfUpgraders < minimumNumberOfUpgraders) {
        // try to spawn one
        name = Game.spawns['Spawn1'].createCustomCreep(energy, 'upgrader');
    }

    // if not enough repairers
    else if (numberOfRepairers < minimumNumberOfRepairers) {
        // try to spawn one
        name = Game.spawns['Spawn1'].createCustomCreep(energy, 'repairer');
    }

    // if not enough wallRepairers
    else if (numberOfWallRepairers < minimumNumberOfWallRepairers) {
        // try to spawn one
        name = Game.spawns['Spawn1'].createCustomCreep(energy, 'wallRepairer');
    }

    else if (numberOfHarvesters < minimumNumberOfHarvesters) {
        // else try to spawn a harvester
        name = Game.spawns['Spawn1'].createCustomCreep(energy, 'harveter');
    }

    else {
      // else try to spawn a heavy lifter
      //name = Game.spawns['Spawn1'].createCustomCreep(energy, 'heavyLifter')
      console.log("too many creep!")
    }

    // print name to console if spawning was a success
    // name > 0 would not work since string > 0 returns false
    if (!(name < 0)) {
        console.log("Spawned new creep: " + creep.name + ' the ' + creep.memory.role);
    }
};
