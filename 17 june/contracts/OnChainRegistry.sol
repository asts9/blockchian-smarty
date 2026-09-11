// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract OnChainRegistry {
    struct Record {
        uint256 id;
        address owner;
        string name;
        string content;
        uint256 createdAt;
    }

    uint256 private nextId = 1;
    mapping(uint256 => Record) private records;
    uint256[] private recordIds;

    event RecordCreated(
        uint256 indexed id,
        address indexed owner,
        string name,
        string content
    );

    function createRecord(string calldata name, string calldata content)
        external
        returns (uint256 id)
    {
        require(bytes(name).length > 0, "Name is required");
        require(bytes(name).length <= 80, "Name is too long");
        require(bytes(content).length > 0, "Content is required");
        require(bytes(content).length <= 500, "Content is too long");

        id = nextId++;
        records[id] = Record(id, msg.sender, name, content, block.timestamp);
        recordIds.push(id);
        emit RecordCreated(id, msg.sender, name, content);
    }

    function getRecord(uint256 id) external view returns (Record memory) {
        require(records[id].id != 0, "Record not found");
        return records[id];
    }

    function getRecords() external view returns (Record[] memory result) {
        result = new Record[](recordIds.length);
        for (uint256 i = 0; i < recordIds.length; i++) {
            result[i] = records[recordIds[i]];
        }
    }
}
