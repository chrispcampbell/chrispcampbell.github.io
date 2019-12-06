# Copyright (c) 2011 by Chris Campbell.
# All rights reserved.
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.

use Flickr::API;
use Data::Dumper;

# Get your Flickr API key here and set the key, secret, and username below:
#   http://www.flickr.com/services/api/misc.api_keys.html
$flickr_api_key = '<your api key>';
$flickr_api_secret = '<your api secret>';
$flickr_username = '<your flickr username>';

my $api = new Flickr::API({'key'    => $flickr_api_key,
                           'secret' => $flickr_api_secret});

# Get the frob
my $frob_response = $api->execute_method('flickr.auth.getFrob', {
   'api_key' => $flickr_api_key,
});
my $frob = $frob_response->{tree}->{children}[1]->{children}[0]->{content};

# If you have an auth token from a previous session, you can save it here
# to avoid going out to the browser each time the script is executed.
# Otherwise we will launch a browser in order to authenticate.
my $token = "";
if ($token eq "") {
    # Authenticate with Flickr in a browser (replace this with the appropriate
    # command to open your preferred browser)
    my $url = $api->request_auth_url("read", $frob);
    my $cmd = "open -a Firefox.app \"$url\"";
    system($cmd);

    # Wait for the user to press enter before continuing
    print "Press enter once you have authorized in the browser\n";
    $user_input = <STDIN>;

    # Get the auth token
    my $token_response = $api->execute_method('flickr.auth.getToken', {
        'api_key' => $flickr_api_key,
        'frob' => $frob,
    });
    #print Dumper($token_response->{tree});
    my $fetched_token = $token_response->{tree}->{children}[1]->{children}[1]->{children}[0]->{content};
    $token = $fetched_token;
    print "Token: $token\n";
}

# Get the photo id and secret for all photos
@all_photos = ();
$page_count = 1;
for ($i = 1; $i <= $page_count; $i++) {
    my $response = $api->execute_method('flickr.people.getPhotos', {
        'user_id' => 'me',
        'auth_token' => $token,
        'page' => $i,
    });

    #print Dumper($response->{tree});

    $page_count = $response->{tree}->{children}[1]->{attributes}->{pages};
    #print "Page $i of $page_count\n";

    my $photos = $response->{tree}->{children}[1]->{children};
    for my $photo (@$photos) {
        if ($photo->{attributes}) {
            my $photo_id = $photo->{attributes}->{id};
            my $photo_secret = $photo->{attributes}->{secret};
            my $photo_farm = $photo->{attributes}->{farm};
            my $photo_server = $photo->{attributes}->{server};
            #print "$photo_id\n";
            my @photo = ($photo_id, $photo_secret, $photo_farm, $photo_server);
            push(@all_photos, \@photo);
        }
    }
}

# Use LR/Transporter to save the Flickr URLs for your Lightroom catalog photos
# to a plain text file with the following name...
open(LR_URLS, "all-photos-in-lr.txt") || die;
@lr_urls = <LR_URLS>;
chomp(@lr_urls);
close(LR_URLS);

my %lr_hash;
@lr_hash{@lr_urls} = ();

my @flickr_urls = ();

print "<html>\n";

print "At Flickr, but not in Lightroom:<br><br>\n";
foreach (@all_photos) {
    my $photo_id = ${$_}[0];
    my $photo_secret = ${$_}[1];
    my $photo_farm = ${$_}[2];
    my $photo_server = ${$_}[3];
    my $flickr_url = "http://www.flickr.com/photos/$flickr_username/$photo_id/";
    push(@flickr_urls, $flickr_url);
    if (not exists $lr_hash{$flickr_url}) {
        print "<a href=\"http://www.flickr.com/photos/$flickr_username/$photo_id/\"><img src=\"http://farm${photo_farm}.static.flickr.com/${photo_server}/${photo_id}_${photo_secret}_z.jpg\"></a><br><br>\n";
    }
}

@flickr_hash{@flickr_urls}=();

print "<br><br>\n";
print "In Lightroom, but not at Flickr:<br><br>\n";
%lr_dup_hash = ();
@lr_dups = ();
foreach $lr_url (@lr_urls) {
    if (exists($lr_dups{$lr_url})) {
        push(@lr_dups, $lr_url);
    } else {
        $lr_dups{$lr_url} = 1;
    }
    if (not exists $flickr_hash{$lr_url}) {
        print "<a href=\"$lr_url\">$lr_url</a><br>\n";
    }
}

print "<br><br>\n";
print "Duplicates in Lightroom:<br><br>\n";
foreach $lr_dup (@lr_dups) {
    print "<a href=\"$lr_dup\">$lr_dup</a><br>\n";
}

print "</html>\n";
