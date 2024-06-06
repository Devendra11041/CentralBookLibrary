namespace Book.Library;

using {reusable.types as types} from './reusabletypes';

entity Book {
    key ID           : Integer not null;
        title        : String(100);
        Author       : String(50);
        ISBN         : String(20);
        genre        : String;
        quantity     : Integer;
        Price        : types.Amount;
        Language     : String(20);
        total_books  : Integer;
        availability : String;
        bookphoto    : LargeString;
        // users        : Association to many User
        //                    on users.book = $self;
        loans        : Association to many ActiveLoans
                           on loans.books = $self;


}

entity User {
    key ID       : Integer not null;
        Username : String(100);
        email    : types.Email not null;
        address  : String;
        phone_no : types.PhoneNumber not null;
        // ReceiveDate  : Date;
        // DueDate      : Date;
        // Active_loans : Integer;
        // books        : Association to Book;
        password : String;
        loans    : Association to many ActiveLoans
                       on loans.users = $self;

}

entity ActiveLoans {
    key ID         : Integer;
        books      : Association to Book;
        users      : Association to User;
        issuseDate : Date;
        DueDate    : Date;

}
