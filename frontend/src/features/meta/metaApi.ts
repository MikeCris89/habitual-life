import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { dbActions } from "../../utils/indexedDb";
import { nanoid } from "nanoid";
import { handleError } from "../../utils/errors";
import { startOfDay } from "../../utils/timeUtils";

export type MetaData = {
	userId: string;
	lastCreatedDate: string;
	theme: string;
	goal: Record<string, number>;
};

export const metaApi = createApi({
	reducerPath: "metaApi",
	baseQuery: fakeBaseQuery(),
	tagTypes: ["MetaData"],
	endpoints: (builder) => ({
		getMeta: builder.query<any, void>({
			queryFn: async () => {
				try {
					const data = await dbActions.getAll("meta");
					if (!data || !data.length) {
						const metaInit: MetaData = {
							userId: nanoid(),
							lastCreatedDate: "",
							theme: "light",
							goal: { [startOfDay()]: 70 },
						};
						await dbActions.setMetaData(metaInit);
						return { data: metaInit };
					}
					if (data.length > 1) {
						handleError("Multiple entries for meta data.");
						return { data: undefined };
					}
					return { data: data[0] };
				} catch (e) {
					return {
						error: { message: `Error fetching meta data from RTK Query: ${e}` },
					};
				}
			},
			providesTags: ["MetaData"],
		}),
		setLastCreatedDate: builder.mutation({
			queryFn: async (userId) => {
				try {
					const data = await dbActions.setLastCreatedDate(userId);
					return { data };
				} catch (e) {
					return {
						error: { message: `Error setting last created date: ${e}` },
					};
				}
			},
			invalidatesTags: ["MetaData"],
		}),
		setGoal: builder.mutation({
			queryFn: async ({ userId, goal }) => {
				try {
					const data = await dbActions.putMetaGoal(userId, goal);
					return { data };
				} catch (e) {
					return {
						error: { message: `Error setting last created date: ${e}` },
					};
				}
			},
			invalidatesTags: ["MetaData"],
		}),
	}),
});

export const {
	useGetMetaQuery,
	useSetLastCreatedDateMutation,
	useSetGoalMutation,
} = metaApi;
