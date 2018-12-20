using Auction.Domain.Exceptions;
using Auction.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Auction.Domain.Managers
{
    public class UserManager 
    {
        private static List<User> Users = new List<User>();

        public static void Add(User entity)
        {
            if (entity == null || string.IsNullOrWhiteSpace(entity.Name) || GetByName(entity.Name) != null )
                throw new DomainException("Invalid name."); ;

            entity.Id = Guid.NewGuid();
            Users.Add(entity);
        }

        public static User GetByName(string name) => Users.FirstOrDefault(e => e.Name.Equals(name, StringComparison.InvariantCultureIgnoreCase));
    }
}
