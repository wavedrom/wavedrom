#!/usr/bin/perl -w
# $Id$
use strict;
use POSIX;
use File::Basename;
use Data::Dumper;
use XML::Parser;

{
	die "usage: " . basename($0) . " source_path\n" unless ($#ARGV == 0);
	my $input = $ARGV[0];
	my ($filename, $directories, $suffix) = fileparse ($input, qr/\.[^.]*/);

	my $indent  = 0;
	my $verbose = 0; # 0 1 2
	my $indent_delta = 0;
	my %histogram;
	my $message = '';

	my %filter = (
		"g"    => ["id"],
		"path" => ["style", "d"],
		"rect" => ["style", "width", "height", "x", "y"]
	);

	sub hdl_start {
		my $p   = shift;
		my $elt = shift;

		if (defined $filter{$elt}) {
			my $ret;
			if ($verbose) {
				$ret = sprintf (",\n%*s[\"%s\"", $indent, '', $elt);
			} else {
				$ret = sprintf (",%*s[\"%s\"", $indent, '', $elt);
			}

			$indent += $indent_delta;
			my $spaces = sprintf ("%*s", $indent, '');

			my @A;
			while (defined (my $a = shift)) {
				my $b = shift;
				for (@{$filter{$elt}}) {
					if ($_ eq $a) {
						if ($a eq 'style') {
							my $index;
							$b = join(';', sort(split(';', $b)));
							if (!defined $histogram{$b}) {
								$histogram{$b}[0] = scalar (keys %histogram) + 1;
							}
							$histogram{$b}[1]++;
							$a = 'class';
							$b = 's' . $histogram{$b}[0];
						}
						push (@A, "\"$a\":\"$b\"");
					}
				}
			}
			@A = sort (@A);
			if (scalar(@A)) {
				if ($verbose > 1) {
					my $attr = join(",\n$spaces", @A);
					$ret .= sprintf (",{\n%s%s\n%s}", $spaces, $attr, $spaces);
				} else {
					my $attr = join(",", @A);
					$ret .= sprintf (",{%s}", $attr);
				}
			}
			$message .= $ret;
		}
	}

	sub hdl_end {
		my ($p, $elt) = @_;

		if (defined $filter{$elt}) {
			$indent -= $indent_delta;
			$message .= "]";
		}
	}

	sub hdl_char {
		my ($p, $str) = @_;
		$str =~ s/\s+//;
		if ($str) {
			$message .= "\"$str\"";
		}
	}

	my $a = XML::Parser->new(
		Style => 'Tree',
		Handlers => {
			Start => \&hdl_start,
#			Char  => \&hdl_char,
			End   => \&hdl_end
		}
	);

	$a->parsefile($input);

	my $css = '';
	for (keys %histogram) {
		my $a = $histogram{$_}->[0];
		my $b = $_;
		$css .= ".s$a\{$b\}";
	}

print <<EOM;
var WaveSkin = WaveSkin || {};
WaveSkin.$filename = ["svg",{"id":"svg","xmlns":"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink","height":"0"}
,["style",{"type":"text/css"},"text{font-size:11pt;font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;text-align:center;fill-opacity:1;font-family:Helvetica}.muted{fill:#aaa}.warning{fill:#f6b900}.error{fill:#f60000}.info{fill:#0041c4}.success{fill:#00ab00}.h1{font-size:33pt;font-weight:bold}.h2{font-size:27pt;font-weight:bold}.h3{font-size:20pt;font-weight:bold}.h4{font-size:14pt;font-weight:bold}.h5{font-size:11pt;font-weight:bold}.h6{font-size:8pt;font-weight:bold}$css"]
,["defs"
$message
,["marker",{"id":"arrowhead", "style":"fill:#0041c4", "markerHeight":"7", "markerWidth":"10", "markerUnits":"strokeWidth", "viewBox":"0 -4 11 8", "refX":"15","refY":"0","orient":"auto"},["path",{"d":"M0 -4 11 0 0 4z"}]]
,["marker",{"id":"arrowtail", "style":"fill:#0041c4", "markerHeight":"7", "markerWidth":"10", "markerUnits":"strokeWidth", "viewBox":"-11 -4 11 8", "refX":"-15","refY":"0","orient":"auto"},["path",{"d":"M0 -4 -11 0 0 4z"}]]
],["g",{"id":"waves"},["g",{"id":"lanes"}],["g",{"id":"groups"}]]]
EOM

}

#,["g",{"id":"wavetemps","style":"display:none"}
#$message
#]

