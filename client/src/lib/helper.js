export const updatePoll = (poll, fieldsToUpdate) => {
	return Object.assign(poll, fieldsToUpdate);
}

export const updatePollList = (updatedPoll, pollList) => {
	let updatedPollList = pollList.map(poll => {
		if(poll._id === updatedPoll._id){
			return updatedPoll;
		} else {
			return poll;
		}
	})
	return updatedPollList;
}

export const addNewPoll = (newPoll, pollList) => {
	return [...pollList, newPoll];
}

export const removePollById = (pollId, pollList) => {
	let index = pollList.findIndex(poll => poll._id === pollId);
	return [...pollList.slice(0, index), ...pollList.slice(index + 1)];
}

export const updateUser = (fieldToUpdate, newItem, user) => {
	let updatedUser = Object.assign({}, user);
	updatedUser[fieldToUpdate] = [...updatedUser[fieldToUpdate], newItem];
	return updatedUser;
}

export const updateUserForPollRemove = (pollId, user) => {
	let {pollCreated} = user;
	let index = pollCreated.findIndex(pollCreatedId => pollCreatedId === pollId);
	pollCreated = [...pollCreated.slice(0, index), ...pollCreated.slice(index + 1)];
	return {...user, pollCreated: pollCreated};
}

export const checkOptions = (rawOptions) => {
	return rawOptions.some(rawOption => rawOption !== '');
}

export const formatOptions = (rawOptions) => {
	return rawOptions
		.filter(rawOption => rawOption !== '')
		.map((rawOption, index) => {
			return {
				optionId: index,
				option: rawOption,
				vote: 0
			}
		});
}