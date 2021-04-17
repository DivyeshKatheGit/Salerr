//get wishlist
const wishlist = $('.wishlist');

for(let i=0;i<wishlist.length;i++)
{
    $(wishlist[i]).click(function (e) {
        
        $('.loader_wrapper').css('display','flex');
        e.preventDefault();
        let id = $(this).data('id');
        let status = $(this).data('status');
        let email = $('#user_email').val();
        console.log('click',id);

        console.log(status);

        if(status === true)
        {
            $.ajax({
                type: "POST",
                url: "/wishlist",
                data: {
                    id : id,
                    email : email,
                    action : 'remove'
                },
                dataType: 'JSON',
                success: function (response) {
                    console.log(response);
                    location.reload();
                    
                }
            });
        }
        else
        {
            $.ajax({
                type: "POST",
                url: "/wishlist",
                data: {
                    id : id,
                    email : email,
                    action : 'add'
                },
                dataType: 'JSON',
                success: function (response) {
                    console.log(response);
                    location.reload();
                    
                }
            });
        }
        
        
    });
}