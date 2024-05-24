using Book.Library as db from '../db/data-model';
@path: '/CentralLibrary'

service EmployeeService {
    entity Book  as projection on db.Book;
    entity User  as projection on db.User;

}