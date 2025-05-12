/**
 * Player Service - Handles all CRUD operations for players
 */

/**
 * Fetch players for a specific game
 * @param {string|number} gameId - Game ID
 * @returns {Promise<Array>} - Array of player objects
 */
export const fetchPlayersByGameId = async (gameId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      Fields: [
        { Field: { Name: "Id" } },
        { Field: { Name: "Name" } },
        { Field: { Name: "position" } },
        { Field: { Name: "color" } },
        { Field: { Name: "game_id" } }
      ],
      where: [
        {
          fieldName: "game_id",
          Operator: "ExactMatch",
          values: [gameId]
        }
      ],
      orderBy: [
        { field: "position", direction: "asc" }
      ]
    };
    
    const response = await apperClient.fetchRecords("player", params);
    
    if (!response || !response.data || response.data.length === 0) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching players for game ${gameId}:`, error);
    throw error;
  }
};

/**
 * Get a player by ID
 * @param {string|number} id - Player ID
 * @returns {Promise<Object>} - Player object
 */
export const getPlayerById = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      Fields: [
        { Field: { Name: "Id" } },
        { Field: { Name: "Name" } },
        { Field: { Name: "position" } },
        { Field: { Name: "color" } },
        { Field: { Name: "game_id" } }
      ]
    };
    
    const response = await apperClient.getRecordById("player", id, params);
    
    if (!response || !response.data) {
      return null;
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching player with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new player
 * @param {Object} playerData - Player data
 * @returns {Promise<Object>} - Created player object
 */
export const createPlayer = async (playerData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      records: [playerData]
    };
    
    const response = await apperClient.createRecord("player", params);
    
    if (!response || !response.success || !response.results || response.results.length === 0 || !response.results[0].success) {
      throw new Error("Failed to create player");
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error("Error creating player:", error);
    throw error;
  }
};

/**
 * Update a player
 * @param {string|number} id - Player ID
 * @param {Object} playerData - Updated player data
 * @returns {Promise<Object>} - Updated player object
 */
export const updatePlayer = async (id, playerData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      records: [{
        Id: id,
        ...playerData
      }]
    };
    
    const response = await apperClient.updateRecord("player", params);
    
    if (!response || !response.success || !response.results || response.results.length === 0 || !response.results[0].success) {
      throw new Error("Failed to update player");
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error(`Error updating player with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a player
 * @param {string|number} id - Player ID
 * @returns {Promise<boolean>} - Success status
 */
export const deletePlayer = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      RecordIds: [id]
    };
    
    const response = await apperClient.deleteRecord("player", params);
    
    if (!response || !response.success || !response.results || response.results.length === 0 || !response.results[0].success) {
      throw new Error("Failed to delete player");
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting player with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete all players for a specific game
 * @param {string|number} gameId - Game ID
 * @returns {Promise<boolean>} - Success status
 */
export const deletePlayersByGameId = async (gameId) => {
  try {
    // First fetch all players for this game
    const players = await fetchPlayersByGameId(gameId);
    
    if (players.length === 0) {
      return true;
    }
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      RecordIds: players.map(player => player.Id)
    };
    
    const response = await apperClient.deleteRecord("player", params);
    
    if (!response || !response.success) {
      throw new Error("Failed to delete players");
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting players for game ${gameId}:`, error);
    throw error;
  }
};