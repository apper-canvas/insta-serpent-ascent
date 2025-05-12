/**
 * Board Element Service - Handles all CRUD operations for board elements (snakes and ladders)
 */

/**
 * Fetch board elements for a specific game
 * @param {string|number} gameId - Game ID
 * @returns {Promise<Array>} - Array of board element objects
 */
export const fetchBoardElementsByGameId = async (gameId) => {
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
        { Field: { Name: "type" } },
        { Field: { Name: "start_position" } },
        { Field: { Name: "end_position" } },
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
        { field: "type", direction: "asc" }
      ]
    };
    
    const response = await apperClient.fetchRecords("board_element", params);
    
    if (!response || !response.data || response.data.length === 0) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching board elements for game ${gameId}:`, error);
    throw error;
  }
};

/**
 * Get a board element by ID
 * @param {string|number} id - Board element ID
 * @returns {Promise<Object>} - Board element object
 */
export const getBoardElementById = async (id) => {
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
        { Field: { Name: "type" } },
        { Field: { Name: "start_position" } },
        { Field: { Name: "end_position" } },
        { Field: { Name: "game_id" } }
      ]
    };
    
    const response = await apperClient.getRecordById("board_element", id, params);
    
    if (!response || !response.data) {
      return null;
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching board element with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new board element
 * @param {Object} elementData - Board element data
 * @returns {Promise<Object>} - Created board element object
 */
export const createBoardElement = async (elementData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      records: [elementData]
    };
    
    const response = await apperClient.createRecord("board_element", params);
    
    if (!response || !response.success || !response.results || response.results.length === 0 || !response.results[0].success) {
      throw new Error("Failed to create board element");
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error("Error creating board element:", error);
    throw error;
  }
};

/**
 * Update a board element
 * @param {string|number} id - Board element ID
 * @param {Object} elementData - Updated board element data
 * @returns {Promise<Object>} - Updated board element object
 */
export const updateBoardElement = async (id, elementData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      records: [{
        Id: id,
        ...elementData
      }]
    };
    
    const response = await apperClient.updateRecord("board_element", params);
    
    if (!response || !response.success || !response.results || response.results.length === 0 || !response.results[0].success) {
      throw new Error("Failed to update board element");
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error(`Error updating board element with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a board element
 * @param {string|number} id - Board element ID
 * @returns {Promise<boolean>} - Success status
 */
export const deleteBoardElement = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      RecordIds: [id]
    };
    
    const response = await apperClient.deleteRecord("board_element", params);
    
    if (!response || !response.success || !response.results || response.results.length === 0 || !response.results[0].success) {
      throw new Error("Failed to delete board element");
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting board element with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete all board elements for a specific game
 * @param {string|number} gameId - Game ID
 * @returns {Promise<boolean>} - Success status
 */
export const deleteBoardElementsByGameId = async (gameId) => {
  try {
    // First fetch all board elements for this game
    const elements = await fetchBoardElementsByGameId(gameId);
    
    if (elements.length === 0) {
      return true;
    }
    
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      RecordIds: elements.map(element => element.Id)
    };
    
    const response = await apperClient.deleteRecord("board_element", params);
    
    if (!response || !response.success) {
      throw new Error("Failed to delete board elements");
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting board elements for game ${gameId}:`, error);
    throw error;
  }
};