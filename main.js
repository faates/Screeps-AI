// import modules
require('prototype.spawn')();
var roleHarvester = require('role.harvester');
var roleHauler = require('role.hauler');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleWallRepairer = require('role.wallRepairer');
var roleLongDistanceHarvester = require('role.longDistanceHarvester');

var HOME = 'E21N8';

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
        // if creep is longDistanceHarvester, call longDistanceHarvester script
        else if (creep.memory.role == 'longDistanceHarvester') {
            roleLongDistanceHarvester.run(creep);
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
    var minimumNumberOfHarvesters = 5;
    var minimumNumberOfHaulers = 3;
    var minimumNumberOfUpgraders = 2;
    var minimumNumberOfBuilders = 2;
    var minimumNumberOfRepairers = 2;
    var minimumNumberOfWallRepairers = 1;
    var minimumNumberOfLongDistanceHarvestersW36S31 = 0;
    var minimumNumberOfLongDistanceHarvestersW38S31 = 0;

    // count the number of creeps alive for each role
    // _.sum will count the number of properties in Game.creeps filtered by the
    //  arrow function, which checks for the creep being a specific role
    var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
    var numberOfHaulers = _.sum(Game.creeps, (c) => c.memory.role == 'hauler');
    var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
    var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
    var numberOfRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'repairer');
    var numberOfWallRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'wallRepairer');
    var numberOfLongDistanceHarvestersW36S31 = _.sum(Game.creeps, (c) =>
        c.memory.role == 'longDistanceHarvester' && c.memory.target == 'W36S31');
    var numberOfLongDistanceHarvestersW38S31 = _.sum(Game.creeps, (c) =>
        c.memory.role == 'longDistanceHarvester' && c.memory.target == 'W38S31');

    var energy = Game.spawns['HomeSpawn'].room.energyCapacityAvailable;
    var name = undefined;

    // if not enough harvesters
    if (numberOfHarvesters < minimumNumberOfHarvesters) {
        // try to spawn one
        name = Game.spawns['HomeSpawn'].createCustomCreep(energy, 'harvester');

        // if spawning failed and we have no harvesters left
        if (name == ERR_NOT_ENOUGH_ENERGY && numberOfHarvesters < 2) {
            // spawn one with what is available
            name = Game.spawns['HomeSpawn'].createCustomCreep(
                Game.spawns['HomeSpawn'].room.energyAvailable, 'harvester');
        }
    }

    // if not enough builders
    else if (numberOfBuilders < minimumNumberOfBuilders) {
        // try to spawn one
        name = Game.spawns['HomeSpawn'].createCustomCreep(energy, 'builder');
    }

    else if (numberOfHaulers < minimumNumberOfHaulers) {
    // try to spawn one
    name = Game.spawns['HomeSpawn'].createCustomCreep(energy, 'hauler');
    }

    // if not enough upgraders
    else if (numberOfUpgraders < minimumNumberOfUpgraders) {
        // try to spawn one
        name = Game.spawns['HomeSpawn'].createCustomCreep(energy, 'upgrader');
    }

    // if not enough repairers
    else if (numberOfRepairers < minimumNumberOfRepairers) {
        // try to spawn one
        name = Game.spawns['HomeSpawn'].createCustomCreep(energy, 'repairer');
    }

    // if not enough wallRepairers
    else if (numberOfWallRepairers < minimumNumberOfWallRepairers) {
        // try to spawn one
        name = Game.spawns['HomeSpawn'].createCustomCreep(energy, 'wallRepairer');
    }

    // if not enough longDistanceHarvesters for W3N5
    //else if (numberOfLongDistanceHarvestersW36S31 < minimumNumberOfLongDistanceHarvestersW36S31) {
        // try to spawn one
        //name = Game.spawns['HomeSpawn'].createLongDistanceHarvester(energy, 5, HOME, 'W36S31', 0);
    //}
    // if not enough longDistanceHarvesters for W2N4
    //else if (numberOfLongDistanceHarvestersW38S31 < minimumNumberOfLongDistanceHarvestersW38S31) {
        // try to spawn one
        //name = Game.spawns['HomeSpawn'].createLongDistanceHarvester(energy, 3, HOME, 'W38S31', 0);
    //}

    else {
        // else try to spawn a builder
        name = Game.spawns['HomeSpawn'].createCustomCreep(energy, 'builder');
    }

    // print name to console if spawning was a success
    // name > 0 would not work since string > 0 returns false
    if (!(name < 0)) {
        console.log("Spawned new creep: " + name);
    }
};