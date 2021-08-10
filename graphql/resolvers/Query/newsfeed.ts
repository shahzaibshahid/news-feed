import db, { AnnouncementRow, NewsFeedRow} from '../../db'

type Args = {
  filter: string,
  limit: number,
  offset: number
}


function getFellowshipFilter (filter: string, type: string) {
  if(filter === 'all') {
    if(type === 'user' || type === 'project') {
      return ``
    } else if(type === 'announcement') {
      return `WHERE fellowship = 'all'`
    }
  } else if(filter === 'founders' || filter === 'angels') {
    return `WHERE fellowship = 'founders' OR fellowship = 'angels'`
  } else if(filter === 'writers') {
    return `WHERE fellowship = 'writers'`
  }
}

type Payload = {
  hasNextPage: boolean,
  newsfeed: NewsFeedRow[]
}

export async function newsfeed(parent: unknown, { filter, limit, offset }: Args): Promise<Payload> {
  let Query = ``
  
  let filters = {
    userQueryFilter: getFellowshipFilter(filter, 'user'),
    projectQueryFilter: getFellowshipFilter(filter, 'project'),
    announcementQueryFilter: getFellowshipFilter(filter, 'announcement')
  };
  
  Query = `
    WITH CombinedQuery AS ( 
      SELECT id, name as title,'user' AS type, bio AS description, created_ts, fellowship FROM users ${filters.userQueryFilter} UNION 
      SELECT projects.id, projects.name as title, 'project' AS type, description, projects.created_ts, users.fellowship FROM projects
      JOIN user_projects ON user_projects.project_id = projects.id
      JOIN users ON user_projects.user_id = users.id ${filters.projectQueryFilter} UNION
      SELECT id, title, 'announcement' AS type, body AS description, created_ts, fellowship FROM announcements ${filters.announcementQueryFilter}
    )
    SELECT * FROM CombinedQuery
    ORDER BY created_ts DESC
    LIMIT ${limit} OFFSET ${offset}
  `
  const newsfeed: NewsFeedRow[] | undefined = await db.getAll(
    Query,
    []
  )
  
  if (!newsfeed) {
    throw new Error(`Newsfeed does not exists!`)
  }
  return {
    hasNextPage: newsfeed.length === limit,
    newsfeed
  }
}