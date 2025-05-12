/**
 * Game Service - Handles all CRUD operations for games
 */

/**
 * Fetch all games
 * @returns {Promise<Array>} - Array of game objects
 */
export const fetchGames = async () => {
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
        { Field: { Name: "game_mode" } },
        { Field: { Name: "board_size" } },
        { Field: { Name: "status" } },
        { Field: { Name: "winner_id" } },
        { Field: { Name: "CreatedOn" } },
        { Field: { Name: "ModifiedOn" } }
      ],
      orderBy: [
        { field: "ModifiedOn", direction: "desc" }
      ]
    };
    
    const response = await apperClient.fetchRecords("game", params);
    
    if (!response || !response.data || response.data.length === 0) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching games:", error);
    throw error;
  }
};

/**
 * Fetch a game by ID
 * @param {string|number} id - Game ID
 * @returns {Promise<Object>} - Game object
 */
export const getGameById = async (id) => {
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
        { Field: { Name: "game_mode" } },
        { Field: { Name: "board_size" } },
        { Field: { Name: "status" } },
        { Field: { Name: "winner_id" } },
        { Field: { Name: "CreatedOn" } },
        { Field: { Name: "CreatedBy" } },
        { Field: { Name: "ModifiedOn" } }
      ]
    };
    
    const response = await apperClient.getRecordById("game", id, params);
    
    if (!response || !response.data) {
      return null;
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching game with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new game
 * @param {Object} gameData - Game data
 * @returns {Promise<Object>} - Created game object
 */
export const createGame = async (gameData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      records: [gameData]
    };
    
    const response = await apperClient.createRecord("game", params);
    
    if (!response || !response.success || !response.results || response.results.length === 0 || !response.results[0].success) {
      throw new Error("Failed to create game");
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error("Error creating game:", error);
    throw error;
  }
};

/**
 * Update a game
 * @param {string|number} id - Game ID
 * @param {Object} gameData - Updated game data
 * @returns {Promise<Object>} - Updated game object
 */
export const updateGame = async (id, gameData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      records: [{
        Id: id,
        ...gameData
      }]
    };
    
    const response = await apperClient.updateRecord("game", params);
    
    if (!response || !response.success || !response.results || response.results.length === 0 || !response.results[0].success) {
      throw new Error("Failed to update game");
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error(`Error updating game with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a game
 * @param {string|number} id - Game ID
 * @returns {Promise<boolean>} - Success status
 */
export const deleteGame = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      RecordIds: [id]
    };
    
    const response = await apperClient.deleteRecord("game", params);
    
    if (!response || !response.success || !response.results || response.results.length === 0 || !response.results[0].success) {
      throw new Error("Failed to delete game");
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting game with ID ${id}:`, error);
    throw error;
  }
};